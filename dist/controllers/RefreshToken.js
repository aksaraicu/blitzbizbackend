"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshToken = void 0;
var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await _UserModel.default.findAll({
      where: {
        refresh_token: refreshToken
      }
    });
    if (!user[0]) return res.sendStatus(403);
    _jsonwebtoken.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const name = user[0].nama_user;
      const email = user[0].email_user;
      const accessToken = _jsonwebtoken.default.sign({
        userId,
        name,
        email
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15s"
      });
      res.json({
        accessToken
      });
    });
  } catch (error) {
    console.log(error);
  }
};
exports.refreshToken = refreshToken;