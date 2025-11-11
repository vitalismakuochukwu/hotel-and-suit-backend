import jwt from "jsonwebtoken"
import Worker from '../models/workerModel.js';

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({isAdmin: true}, process.env.JWT_SECRET)
            res.json({ success: true, token, message: "Admin logged in" })
        } else {
            res.json({ success: false, message: "invalid login details" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error login in admin" })
    }
}

export const getWorkers = async (req, res) => {
    try {
        console.log('Fetching workers data...');
        const workers = await Worker.find({})
            .select('-password -__v')
            .sort({ createdAt: -1 });

        console.log(`Found ${workers.length} workers`);

        if (!workers || workers.length === 0) {
            return res.status(200).json({
                success: true,
                workers: [],
                message: 'No workers found'
            });
        }

        res.status(200).json({
            success: true,
            workers,
            message: 'Workers fetched successfully'
        });
    } catch (error) {
        console.error('Error in getWorkers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch workers: ' + error.message
        });
    }
};

export const deleteWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await Worker.findByIdAndDelete(id);
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Worker deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteWorker:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete worker: ' + error.message
        });
    }
};

export { adminLogin }
