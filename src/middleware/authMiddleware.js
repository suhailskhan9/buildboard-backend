import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                message: "Authorization token missing"
            })
        }
        
        const authHeaderParts = authHeader.split(" ");
        if(authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Malformed authorization header"
            }) 
        }

        const token = authHeaderParts[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decodedToken;
        next();
    }
    catch(err) {
        console.error("Error in auth middleware: ", err);
        return res.status(401).json({
            message: "Authentication failed"
        })
    }
}

export default authMiddleware;