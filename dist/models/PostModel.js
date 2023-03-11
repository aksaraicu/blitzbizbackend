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
const Posts = _Database.default.define("bb_posts", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  gambar: {
    type: DataTypes.STRING
  },
  kategori: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true
});
_UserModel.default.hasMany(Posts, {
  onDelete: "CASCADE"
});
Posts.belongsTo(_UserModel.default, {
  onDelete: "CASCADE"
});
var _default = Posts;
exports.default = _default;
(async () => {
  await _Database.default.sync();
})();