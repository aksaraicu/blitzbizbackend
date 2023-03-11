import { Sequelize } from "sequelize";
import db from "../config/Database.js";
// import UserData from "./UserDataModel.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "bb_users",
  {
    nama_lengkap_user: {
      type: DataTypes.STRING,
      allowNull: false,
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
        notEmpty: true,
      },
    },
    email_user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    password_user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gambar_user: DataTypes.STRING,
    link_gambar_user: DataTypes.STRING,
    reset_password_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;

(async () => {
  await db.sync();
})();
