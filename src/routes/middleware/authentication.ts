import {Request, NextFunction} from "express";
import { APIResponse } from "../../interface";
import jwt from "jsonwebtoken";

// Put it in env
const secretKey = "socialSecretKey";

module.exports = (req: Request, res: APIResponse, next: NextFunction) => {
    try {
        const token: string = req.headers.authorization!.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Authentication Failed" });
        res.decodedData = jwt.verify(token, secretKey);
        next();
    } catch (error: any) {
        return res.status(401).json({ message: "Authentication Failed" });
    }
};
