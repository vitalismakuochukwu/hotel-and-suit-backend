import express from 'express'
import { createReservation,getAllReservation,deleteReservation } from '../controllers/reservationcontroller.js'

const router =express.Router()

router.post('/create', createReservation)
router.get('/getall', getAllReservation)
router.delete('/delete/:id', deleteReservation)

export default router