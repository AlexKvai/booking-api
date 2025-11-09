import { pool } from '../db.js'

/**
 * POST /api/bookings/reserve
 */
export const reserveBooking = async (req, res) => {
	const { event_id, user_id } = req.body

	if (!event_id || !user_id) {
		return res.status(400).json({ error: 'event_id и user_id обязательны' })
	}

	const conn = await pool.getConnection()
	try {
		await conn.beginTransaction()

		// Проверка: есть ли уже бронь для этого пользователя
		const [existing] = await conn.query(
			'SELECT id FROM bookings WHERE event_id = ? AND user_id = ?',
			[event_id, user_id]
		)

		if (existing.length > 0) {
			await conn.rollback()
			return res
				.status(400)
				.json({ error: 'Пользователь уже забронировал место на это событие' })
		}

		// Проверка события
		const [[event]] = await conn.query(
			'SELECT id, name, total_seats FROM events WHERE id = ?',
			[event_id]
		)

		if (!event) {
			await conn.rollback()
			return res.status(404).json({ error: 'Событие не найдено' })
		}

		// Проверка наличия мест
		const [[{ count }]] = await conn.query(
			'SELECT COUNT(*) AS count FROM bookings WHERE event_id = ?',
			[event_id]
		)

		if (count >= event.total_seats) {
			await conn.rollback()
			return res.status(400).json({ error: 'Все места уже заняты' })
		}

		// Добавляем бронь
		await conn.query('INSERT INTO bookings (event_id, user_id) VALUES (?, ?)', [
			event_id,
			user_id,
		])

		await conn.commit()
		res.json({ success: true, message: 'Место успешно забронировано' })
	} catch (error) {
		await conn.rollback()
		console.error(error)
		res.status(500).json({ error: 'Ошибка сервера' })
	} finally {
		conn.release()
	}
}

/**
 * GET /api/bookings/events/:id
 */
export const getEventInfo = async (req, res) => {
	const { id } = req.params

	try {
		const [[event]] = await pool.query(
			'SELECT id, name, total_seats FROM events WHERE id = ?',
			[id]
		)

		if (!event) {
			return res.status(404).json({ error: 'Событие не найдено' })
		}

		const [[{ booked_count }]] = await pool.query(
			'SELECT COUNT(*) AS booked_count FROM bookings WHERE event_id = ?',
			[id]
		)

		const remaining = Math.max(event.total_seats - booked_count, 0)

		res.json({
			id: event.id,
			name: event.name,
			total_seats: event.total_seats,
			booked_seats: booked_count,
			available_seats: remaining,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}
