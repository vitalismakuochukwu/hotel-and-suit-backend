import express from 'express'
import { RegisterNewWorker, GetAllWorkers, GetSingleWorker, UpdateSingleWorker, DeleteSingleWorker, Login, UpdateWorkerProfile, GetWorkerProfile, getAttendance, getWorkerAttendance, UpdateWorkerSalary, MarkWorkerLeave, GetWorkersCount } from '../controllers/workerController.js'
import workerAuth from '../middleware/workerAuth.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.post('/register', adminAuth, upload.any(), RegisterNewWorker)
router.get('/getall', GetAllWorkers)
router.get('/get/:id',  GetSingleWorker)
router.put('/update/:id',  UpdateSingleWorker)
router.delete('/delete/:id',  DeleteSingleWorker)
router.post('/login', Login)
router.post('/update-profile', workerAuth, UpdateWorkerProfile)
router.post('/get-profile', workerAuth, GetWorkerProfile)
router.get('/getAttendance', adminAuth, getAttendance)
router.post('/attendance', workerAuth, getWorkerAttendance)
router.put('/salary/:id', adminAuth, UpdateWorkerSalary)
router.put('/leave/:id', adminAuth, MarkWorkerLeave)
router.get('/count', GetWorkersCount)

export default router
