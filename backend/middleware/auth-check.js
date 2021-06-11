const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {
            id: decodedToken.userId,
            characterId : decodedToken.characterId,
            level: decodedToken.level,
            rank:decodedToken.rank,
            money:decodedToken.money,
            language:decodedToken.language,
            name:decodedToken.name,
        };
        next();
    } catch (error) {
        res.status(401).json({ message:"Auth failed!" });
    }

}