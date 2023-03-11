"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _Database = _interopRequireDefault(require("../config/Database.js"));
var _ListingModel = _interopRequireDefault(require("./ListingModel.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  DataTypes
} = _sequelize.Sequelize;
const ListingData = _Database.default.define("bb_listing_data", {
  hasil_perbulan_listing: {
    type: DataTypes.BIGINT,
    allowNull: true
    // validate: {
    //   isInt: true,
    //   min: 0,
    // },
  },

  pengeluaran_perbulan_listing: {
    type: DataTypes.BIGINT,
    allowNull: true
    // validate: {
    //   isInt: true,
    //   min: 0,
    // },
  },

  total_pengunjung_listing: {
    type: DataTypes.BIGINT,
    allowNull: true
    // validate: {
    //   isInt: true,
    //   min: 0,
    // },
  },

  pengguna_aktif_listing: {
    type: DataTypes.BIGINT,
    allowNull: true
    // validate: {
    //   isInt: true,
    //   min: 0,
    // },
  }
}, {
  freezeTableName: true
});
_ListingModel.default.hasOne(ListingData, {
  onDelete: "CASCADE"
});
ListingData.belongsTo(_ListingModel.default, {
  onDelete: "CASCADE"
});
var _default = ListingData;
exports.default = _default;
(async () => {
  await _Database.default.sync();
})();