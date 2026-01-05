const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'auth_key', (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token',
                    error: err.message
                });
            }
            
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};

const requireAdmin = (req,res,next)=>{
    if (!req.user) {
        return res.status(401).json({ success:false, message:'Unauthenticated' });
    }
    // When signing token we embed id only; fetch role from header override if provided by controller
    // Prefer role in req.user.role if present
    if (req.user.role === 'admin') return next();
    return res.status(403).json({ success:false, message:'Admin privileges required' });
};

module.exports = authenticateToken;
module.exports.requireAdmin = requireAdmin;