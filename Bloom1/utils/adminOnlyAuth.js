import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            
            req.userId = decoded._id;
            req.userRole = decoded.role;

            if (!['admin'].includes(req.userRole)) {
                return res.status(403).json({
                    message: 'Access denied: insufficient role',
                });
            }

            next();
        } catch (e) {
            return res.status(403).json({
                message: 'Access denied',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Access denied',
        });
    }
};