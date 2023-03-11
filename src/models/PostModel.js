import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Posts = db.define(
  "bb_posts",
  {
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gambar: {
      type: DataTypes.STRING,
    },
    kategori: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Posts, { onDelete: "CASCADE" });
Posts.belongsTo(Users, { onDelete: "CASCADE" });

export default Posts;

(async () => {
  await db.sync();
})();