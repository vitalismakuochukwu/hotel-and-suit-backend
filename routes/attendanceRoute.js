import express from 'express'
import {getAttendance, markAttendance} from '../controllers/attendanceController.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

router.get('/', adminAuth, getAttendance)
router.post('/mark', adminAuth, markAttendance)


export default router
