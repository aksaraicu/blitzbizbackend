import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const UserData = db.define(
  "bb_user_data",
  {
    status_user: {
      type: DataTypes.ENUM("Online", "Offline", "Away"),
      defaultValue: "Offline",
      allowNull: false,
    },
    peran_user: {
      type: DataTypes.ENUM("Admin", "Pengguna", "Kontributor"),
      defaultValue: "Pengguna",
      allowNull: false,
    },
    verifikasi_user: {
      type: DataTypes.ENUM(
        "Terverifikasi",
        "Pending verifikasi",
        "Belum terverifikasi"
      ),
      defaultValue: "Belum terverifikasi",
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasOne(UserData, { onDelete: "CASCADE" });
UserData.belongsTo(Users, { onDelete: "CASCADE" });

export default UserData;

(async () => {
  await db.sync();
})();
