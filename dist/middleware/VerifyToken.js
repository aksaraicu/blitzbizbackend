"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyToken = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const VerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  try {
    _jsonwebtoken.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.email = decoded.email;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
};
exports.VerifyToken = VerifyToken;