import { pool } from '../db.js'

const seed = async () => {
	await pool.query('DELETE FROM events')
	await pool.query(
		'INSERT INTO events (name, total_seats) VALUES (?, ?), (?, ?), (?, ?)',
		['JavaScript Meetup', 10, 'AI & ML Conference', 5, 'Node.js Workshop', 3]
	)
	console.log('✅ Seed completed')
	process.exit(0)
}

seed().catch(e => {
	console.error('❌ Seed error:', e)
	process.exit(1)
})
