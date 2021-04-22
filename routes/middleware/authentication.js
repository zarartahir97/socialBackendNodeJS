const jwt = require("jsonwebtoken");

// Put it in env
const secretKey = "socialSecretKey";

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Authentication Failed" });
        res.decodedData = jwt.verify(token, secretKey);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication Failed" });
    }
};
