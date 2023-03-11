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
const ListingLink = _Database.default.define("bb_listing_link", {
  link_website_listing: {
    type: DataTypes.STRING,
    allowNull: true
    // validate: {
    //   isUrl: true,
    // },
  },

  link_kontak_listing: {
    type: DataTypes.STRING,
    allowNull: true
    // validate: {
    //   isUrl: true,
    // },
  },

  link_youtube_listing: {
    type: DataTypes.STRING,
    allowNull: true
    // validate: {
    //   isUrl: true,
    // },
  }
}, {
  freezeTableName: true
});
_ListingModel.default.hasOne(ListingLink, {
  onDelete: "CASCADE"
});
ListingLink.belongsTo(_ListingModel.default, {
  onDelete: "CASCADE"
});
var _default = ListingLink;
exports.default = _default;
(async () => {
  await _Database.default.sync();
})();