import { Sequelize } from "sequelize";

const db = new Sequelize("bb_cms", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
