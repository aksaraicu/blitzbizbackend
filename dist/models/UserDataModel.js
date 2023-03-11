"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _Database = _interopRequireDefault(require("../config/Database.js"));
var _UserModel = _interopRequireDefault(require("./UserModel.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  DataTypes
} = _sequelize.Sequelize;
const UserData = _Database.default.define("bb_user_data", {
  status_user: {
    type: DataTypes.ENUM("Online", "Offline", "Away"),
    defaultValue: "Offline",
    allowNull: false
  },
  peran_user: {
    type: DataTypes.ENUM("Admin", "Pengguna", "Kontributor"),
    defaultValue: "Pengguna",
    allowNull: false
  },
  verifikasi_user: {
    type: DataTypes.ENUM("Terverifikasi", "Pending verifikasi", "Belum terverifikasi"),
    defaultValue: "Belum terverifikasi",
    allowNull: true
  }
}, {
  freezeTableName: true
});
_UserModel.default.hasOne(UserData, {
  onDelete: "CASCADE"
});
UserData.belongsTo(_UserModel.default, {
  onDelete: "CASCADE"
});
var _default = UserData;
exports.default = _default;
(async () => {
  await _Database.default.sync();
})();