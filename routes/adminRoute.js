import express from 'express'
import { adminLogin, getWorkers, deleteWorker } from '../controllers/adminController.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

router.post('/login', adminLogin)
router.get('/workers', adminAuth, getWorkers)
router.delete('/workers/:id', adminAuth, deleteWorker)

export default router
