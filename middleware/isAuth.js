import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

async function CheckAuth(req, res, next) {
    try {
        const { Token } = req?.cookies;

        // Check Token exist or not
        if (!Token) {
            return res.status(400).json({
                message: "Invalid user",
                success: false,
            });
        }

        // Verift Token
        const VerifyPassword = await jwt.verify(
            Token,
            process.env.jwtSecrateKey
        );
        if (!VerifyPassword) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.userId = VerifyPassword.Token;
        next();
    } catch (error) {
        res.status(500).json({
            message: "Check auth server down",
            success: false,
        });
    }
}
export default CheckAuth;
