import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Listings from "./ListingModel.js";

const { DataTypes } = Sequelize;

const ListingData = db.define(
  "bb_listing_data",
  {
    hasil_perbulan_listing: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // validate: {
      //   isInt: true,
      //   min: 0,
      // },
    },
    pengeluaran_perbulan_listing: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // validate: {
      //   isInt: true,
      //   min: 0,
      // },
    },
    total_pengunjung_listing: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // validate: {
      //   isInt: true,
      //   min: 0,
      // },
    },
    pengguna_aktif_listing: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // validate: {
      //   isInt: true,
      //   min: 0,
      // },
    },
  },
  {
    freezeTableName: true,
  }
);

Listings.hasOne(ListingData, { onDelete: "CASCADE" });
ListingData.belongsTo(Listings, { onDelete: "CASCADE" });

export default ListingData;

(async () => {
  await db.sync();
})();
