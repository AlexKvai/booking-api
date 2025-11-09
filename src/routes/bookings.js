import express from 'express'
import {
	getEventInfo,
	reserveBooking,
} from '../controllers/bookingsController.js'

const router = express.Router()

// Бронирование места
router.post('/reserve', reserveBooking)

// Информация о событии
router.get('/events/:id', getEventInfo)

export default router
