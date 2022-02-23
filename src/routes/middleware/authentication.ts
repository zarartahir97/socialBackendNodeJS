import { Request, NextFunction } from 'express';
import { APIResponse } from '../../interface';
import jwt from 'jsonwebtoken';

module.exports = (req: Request, res: APIResponse, next: NextFunction) => {
	try {
		const token: string = req.headers.authorization!.split(' ')[1];
		if (!token)
			return res.status(401).json({ message: 'Authentication Failed' });
		res.decodedData = jwt.verify(token, process.env.SECRET_KEY!);
		next();
	} catch (error: any) {
		return res.status(401).json({ message: 'Authentication Failed' });
	}
};
