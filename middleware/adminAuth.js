import jwt from "jsonwebtoken"

const adminAuth =async(req,res,next) =>{
    try {
        const token = req.header('admin-token');

        if (!token) {
            return res.json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!token_decode.isAdmin) {
            return res.json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        next()
    } catch (error) {
        console.log(error);
      return res.json({
            success: false,
            message: 'Authentication not successful'
        });
    }
}

export default adminAuth