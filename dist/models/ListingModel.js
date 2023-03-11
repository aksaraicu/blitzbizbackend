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
const Listings = _Database.default.define("bb_listings", {
  nama_listing: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slogan_listing: {
    type: DataTypes.STRING,
    allowNull: true
  },
  harga_listing: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  deskripsi_listing: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  gambar_listing: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link_gambar_listing: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true
});
_UserModel.default.hasMany(Listings, {
  onDelete: "CASCADE"
});
Listings.belongsTo(_UserModel.default, {
  onDelete: "CASCADE"
});
var _default = Listings;
exports.default = _default;
(async () => {
  await _Database.default.sync();
})();