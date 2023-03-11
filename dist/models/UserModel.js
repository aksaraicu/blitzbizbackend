"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _Database = _interopRequireDefault(require("../config/Database.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import UserData from "./UserDataModel.js";

const {
  DataTypes
} = _sequelize.Sequelize;
const Users = _Database.default.define("bb_users", {
  nama_lengkap_user: {
    type: DataTypes.STRING,
    allowNull: false
    // validate: {
    //   notEmpty: true,
    //   is: /^[a-zA-Z\s]*$/,
    // },
  },

  nama_user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email_user: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  password_user: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  gambar_user: DataTypes.STRING,
  link_gambar_user: DataTypes.STRING,
  reset_password_link: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true
});
var _default = Users;
exports.default = _default;
(async () => {
  await _Database.default.sync();
})();