"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kirimEmail = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();

// Using SMTP
const kirimEmail = _nodemailer.default.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// USING SENDGRID
// import nodemailerSendgrid from "nodemailer-sendgrid";
// export const kirimEmail = nodemailer.createTransport(
//     nodemailerSendgrid({
//         apiKey: process.env.SENDGRID_API_KEY
//     })
// );
exports.kirimEmail = kirimEmail;