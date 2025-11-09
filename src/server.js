import dotenv from 'dotenv'
import app from './app.js'
import { migrate } from './migrate.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const startServer = async () => {
	try {
		await migrate()
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`)
		})
	} catch (err) {
		console.error('Ошибка миграции:', err)
		process.exit(1)
	}
}

startServer()
