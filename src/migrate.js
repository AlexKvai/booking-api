import { pool } from './db.js'

export async function migrate() {
	console.log('Проверка структуры БД...')

	// Создаем таблицу events, если нет
	await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      total_seats INT NOT NULL
    )
  `)

	// Создаем таблицу bookings, если нет
	await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `)

	console.log('Таблицы проверены (созданы, если отсутствовали).')

	// Проверим, есть ли события
	const [events] = await pool.query('SELECT COUNT(*) AS cnt FROM events')
	if (events[0].cnt === 0) {
		await pool.query(
			'INSERT INTO events (name, total_seats) VALUES (?, ?), (?, ?), (?, ?)',
			['JavaScript Meetup', 10, 'AI & ML Conference', 5, 'Node.js Workshop', 3]
		)
		console.log('Тестовые события добавлены.')
	} else {
		console.log('События уже существуют, сидер пропущен.')
	}
}
