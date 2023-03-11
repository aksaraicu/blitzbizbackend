"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPassword = exports.Me = exports.Logout = exports.Login = exports.ForgotPassword = void 0;
var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));
var _UserDataModel = _interopRequireDefault(require("../models/UserDataModel.js"));
var _argon = _interopRequireDefault(require("argon2"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _index = require("../helpers/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Login = async (req, res) => {
  try {
    const email_user = req.body.email_user;
    const user = await _UserModel.default.findOne({
      where: {
        email_user: email_user
      },
      include: [{
        model: _UserDataModel.default,
        attributes: ["peran_user"]
      }]
    });
    if (!user) return res.status(404).json({
      msg: `user tidak ditemukan`
    });
    // console.log(user.password_user)
    const match = await _argon.default.verify(user.password_user, req.body.password_user);
    // console.log(match)
    if (!match) return res.status(400).json({
      msg: "Wrong Password"
    });
    // res.status(200).json({msg: "Cocok nih Password"});
    const userId = user.id;
    const name = user.nama_user;
    const email = user.email_user;
    const role = user.bb_user_datum.peran_user;
    const accessToken = _jsonwebtoken.default.sign({
      userId,
      name,
      email,
      role
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s"
    });
    const refreshToken = _jsonwebtoken.default.sign({
      userId,
      name,
      email,
      role
    }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d"
    });
    await _UserModel.default.update({
      refresh_token: refreshToken
    }, {
      where: {
        id: userId
      }
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({
      accessToken
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};
exports.Login = Login;
const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log(req.cookies.refreshToken)
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var email = decoded.email;
  const user = await _UserModel.default.findOne({
    where: {
      email_user: email
    }
  });
  if (!user) return res.sendStatus(204);
  res.clearCookie("refreshToken");
  return res.status(200).json({
    msg: "Sukses Logout"
  });
};
exports.Logout = Logout;
const Me = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      msg: "Mohon login ke akun Anda!"
    });
  }
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var email_user = decoded.email;
  console.log(email_user);
  const user = await _UserModel.default.findOne({
    attributes: ["id", "nama_user", "email_user", "link_gambar_user"],
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
  res.status(200).json(user);
};
exports.Me = Me;
const ForgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await _UserModel.default.findOne({
    attributes: ["id", "nama_user", "email_user", "reset_password_link"],
    where: {
      email_user: email
    }
  });
  if (!user) {
    return res.status(401).json({
      status: false,
      message: 'Email ini tidak memiliki akun'
    });
  }
  const token = _jsonwebtoken.default.sign(user.id, process.env.ACCESS_TOKEN_SECRET);
  // console.log(token)

  await _UserModel.default.update({
    reset_password_link: token
  }, {
    where: {
      email_user: req.body.email
    }
  });
  const isiEmail = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Kesulitan Login ? Silahkan Reset Password Anda",
    html: `<p>Silahkan klik link di bawah ini untuk reset password akun Blitbiz Anda</p>
             <p><strong><a href="${process.env.CLIENT_URL}/resetpassword/${token}">Reset Password</a><strong></p>
             <p>Abaikan pesan ini jika anda tidak membuat permintaan reset password ini.</p>`
  };
  // console.log(isiEmail)
  _index.kirimEmail.sendMail(isiEmail, (err, info) => {
    if (err) throw err;
    console.log('Email sent: ' + info.response);
  });
  return res.status(200).json({
    status: true,
    message: req.body.email
  });
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = async (req, res) => {
  const {
    token,
    password
  } = req.body;
  console.log('token', token);
  console.log('password', password);
  const user = await _UserModel.default.findOne({
    attributes: ["id", "nama_user", "email_user", "password_user"],
    where: {
      reset_password_link: token
    }
  });
  if (!user) {
    return res.status(401).json({
      status: false,
      message: 'Token tidak valid !'
    });
  }
  const hashPassword = await _argon.default.hash(password);
  await _UserModel.default.update({
    password_user: hashPassword,
    reset_password_link: null
  }, {
    where: {
      reset_password_link: token
    }
  });
  console.log("Password sukses diperbaharui");
  return res.status(201).json({
    msg: "Password sukses diperbaharui"
  });
};
exports.ResetPassword = ResetPassword;