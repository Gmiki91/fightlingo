const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {
            id: decodedToken.userId,
            currentCharacter : decodedToken.currentCharacter
            /*
            level: decodedToken.userLevel,
            rank:decodedToken.userRank,
            money:decodedToken.userMoney,
            language:decodedToken.userLanguage,
            name:decodedToken.userName,*/
        };
        next();
    } catch (error) {
        res.status(401).json({ message:"Auth failed!" });
    }

}