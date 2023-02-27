import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Listings from "./ListingModel.js";

const { DataTypes } = Sequelize;

const ListingLink = db.define(
  "bb_listing_link",
  {
    link_website_listing: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   isUrl: true,
      // },
    },
    link_kontak_listing: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   isUrl: true,
      // },
    },
    link_youtube_listing: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   isUrl: true,
      // },
    },
  },
  {
    freezeTableName: true,
  }
);

Listings.hasOne(ListingLink, { onDelete: "CASCADE" });
ListingLink.belongsTo(Listings, { onDelete: "CASCADE" });

export default ListingLink;

(async () => {
  await db.sync();
})();
