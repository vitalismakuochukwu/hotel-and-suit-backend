import jwt from "jsonwebtoken";

const workerAuth = async (req, res, next) => {
  try {
    const { 'worker-token': token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Unauthorized User" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.workerId = token_decode.id; // Assuming the token contains the worker's ID
    next();
  } catch (error) {
    return res.json({ success: false, message: "Authentication not successful" });
  }
};

export default workerAuth;
