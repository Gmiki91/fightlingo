const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "lol_not_very_cryptic");
        req.userData = {
            id: decodedToken.userId,
            level: decodedToken.userLevel,
            rank:decodedToken.userRank,
            money:decodedToken.userMoney,
            language:decodedToken.userLanguage
        };
        next();
    } catch (error) {
        res.status(401).json({ message:"Auth failed!" });
    }

}