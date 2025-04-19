import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route. Please log in again."
        });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecoded?.id) {
            req.user = { id: tokenDecoded.id };

        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again."
            });
        }
        // console.log("User Authentication middleware succesfully executed");
        next();
    } catch (error) {
        console.log("Error in userAuth middleware:", error);

        return res.status(500).json({
            success: false,
            message: `Internal Server Error. Authentication failed in middleware.\nError: ${error.message}`
        });
    }
};

export default userAuth;
