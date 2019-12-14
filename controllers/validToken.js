const jwt = require("jsonwebtoken");
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';
exports.valid = (req, res, next) => {
    try {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        req.userData = { email: decode.user,Id:decode.Id,Role:decode.Role };
        next();
    } catch (error) {
        res.status(404).json({ Message: "Authentication Failed" });
    }

}