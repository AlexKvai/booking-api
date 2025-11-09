import express from 'express'
import { pool } from '../db.js'

const router = express.Router()

/**
 * POST /api/bookings/reserve
 * { "event_id": 1, "user_id": "user123" }
 */
router.post('/reserve', async (req, res) => {
	const { event_id, user_id } = req.body

	if (!event_id || !user_id) {
		return res.status(400).json({ error: 'event_id и user_id обязательны' })
	}

	const conn = await pool.getConnection()
	try {
		await conn.beginTransaction()

		// Проверяем, есть ли пользователь уже на этом событии
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

		// Проверяем наличие мест
		const [[event]] = await conn.query(
			'SELECT total_seats FROM events WHERE id = ?',
			[event_id]
		)

		if (!event) {
			await conn.rollback()
			return res.status(404).json({ error: 'Событие не найдено' })
		}

		const [[{ count }]] = await conn.query(
			'SELECT COUNT(*) AS count FROM bookings WHERE event_id = ?',
			[event_id]
		)

		if (count >= event.total_seats) {
			await conn.rollback()
			return res.status(400).json({ error: 'Все места уже заняты' })
		}

		// Бронируем место
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
})

export default router
