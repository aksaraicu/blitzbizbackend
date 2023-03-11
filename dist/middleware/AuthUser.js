"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyUser = exports.isKontributor = exports.isAdmin = void 0;
var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));
var _UserDataModel = _interopRequireDefault(require("../models/UserDataModel.js"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const verifyUser = async (req, res, next) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).json({
      msg: "Mohon login ke akun Anda!"
    });
  }
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var email = decoded.email;

  // console.log(decoded)
  const user = await _UserModel.default.findOne({
    where: {
      email_user: email
    }
  });
  if (!user) return res.status(404).json({
    msg: "User tidak ditemukan"
  });
  var role = decoded.role;
  next();
};
exports.verifyUser = verifyUser;
const isAdmin = async (req, res, next) => {
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  console.log(role);
  const user = await _UserModel.default.findOne({
    where: {
      id: userId
    },
    include: [{
      model: _UserDataModel.default,
      attributes: ["peran_user"]
    }]
  });
  if (!user) return res.status(404).json({
    msg: "User tidak ditemukan"
  });
  if (role !== "Admin") return res.status(403).json({
    msg: role
  });
  next();
};
exports.isAdmin = isAdmin;
const isKontributor = async (req, res, next) => {
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  console.log(role);
  const user = await _UserModel.default.findOne({
    where: {
      id: userId
    },
    include: [{
      model: _UserDataModel.default,
      attributes: ["peran_user"]
    }]
  });
  if (!user) return res.status(404).json({
    msg: "User tidak ditemukan"
  });
  if (role !== "Kontributor") return res.status(403).json({
    msg: "Akses terlarang"
  });
  next();
};
exports.isKontributor = isKontributor;