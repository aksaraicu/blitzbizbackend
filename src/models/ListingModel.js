import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Listings = db.define(
  "bb_listings",
  {
    nama_listing: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slogan_listing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    harga_listing: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    deskripsi_listing: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gambar_listing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link_gambar_listing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Listings, { onDelete: "CASCADE" });
Listings.belongsTo(Users, { onDelete: "CASCADE" });

export default Listings;

(async () => {
  await db.sync();
})();