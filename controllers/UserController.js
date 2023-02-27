import User from "../models/UserModel.js";
import UserData from "../models/UserDataModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const totalBaris = await User.count({
    where: {
      [Op.or]: [
        {
          nama_user: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          nama_lengkap_user: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          email_user: {
            [Op.like]: "%" + cari + "%",
          },
        },
      ],
    },
  });
  const totalHalaman = Math.ceil(totalBaris / limit);
  const hasil = await User.findAll({
    attributes: {
      exclude: ["password_user", "createdAt", "updatedAt"],
    },
    include: {
      model: UserData,
      attributes: {
        exclude: ["createdAt", "updatedAt", "bbUserId"],
      },
    },
    where: {
      [Op.or]: [
        {
          nama_user: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          nama_lengkap_user: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          email_user: {
            [Op.like]: "%" + cari + "%",
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    // order: [["id", "DESC"]],
  });
  res.json({
    hasil: hasil,
    halaman: halaman,
    limit: limit,
    totalBaris: totalBaris,
    totalHalaman: totalHalaman,
  });
};

export const getUserByID = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["password_user", "createdAt", "updatedAt"],
      },
      include: {
        model: UserData,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
  }
};

export const createUser = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada file yang terunggah" });

  const nama_lengkap_user = req.body.nama_lengkap_user;
  const nama_user = req.body.nama_user;
  const email_user = req.body.email_user;
  const password_user = req.body.password_user;
  let status_user = req.body.status_user;
  let peran_user = req.body.peran_user;
  let verifikasi_user = req.body.verifikasi_user;

  const gambar = req.files.gambar_user;

  const ext = path.extname(gambar.name);
  const fileName = gambar.md5;
  const data = req.files.gambar_user.data;
  const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];

  if (!allowwedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Ekstensi gambar salah" });

  // if (
  //   peran_user !== "Admin" &&
  //   peran_user !== "Kontributor" &&
  //   peran_user !== "Pengguna"
  // )
  //   peran_user = "Pengguna";

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  let format;

  await sharp(data)
    .resize(600)
    .toFile(`./public/gambar/users/${fileName}.webp`)
    .then((data) => {
      format = data.format;
    });

  const url = `${req.protocol}://${req.get(
    "host"
  )}/gambar/users/${fileName}.${format}`;

  try {
    const hashPassword = await argon2.hash(password_user);
    User.create({
      nama_lengkap_user: nama_lengkap_user,
      nama_user: nama_user,
      email_user: email_user,
      password_user: hashPassword,
      gambar_user: `${fileName}.${format}`,
      link_gambar_user: url,
    }).then(async (data) => {
      await UserData.create({
        bbUserId: data.id,
        status_user: status_user,
        peran_user: peran_user,
        verifikasi_user: verifikasi_user,
      });
    });
    res.status(201).json({ msg: "User sukses ditambahkan" });
  } catch (error) {
    console.error(error.message);
  }
};

export const registerUser = async (req, res) => {
  const nama_lengkap_user = req.body.nama_lengkap_user;
  const nama_user = req.body.nama_user;
  const email_user = req.body.email_user;
  const password_user = req.body.password_user;
  let status_user = req.body.status_user;
  let peran_user = req.body.peran_user;
  let verifikasi_user = req.body.verifikasi_user;
  const gambar_user = "default.webp";
  const url = `${req.protocol}://${req.get("host")}/gambar/users/default.webp`;
  try {
    const hashPassword = await argon2.hash(password_user);
    User.create({
      nama_lengkap_user: nama_lengkap_user,
      nama_user: nama_user,
      email_user: email_user,
      password_user: hashPassword,
      gambar_user: gambar_user,
      link_gambar_user: url,
    }).then(async (data) => {
      await UserData.create({
        bbUserId: data.id,
        status_user: status_user,
        peran_user: peran_user,
        verifikasi_user: verifikasi_user,
      });
    });
    res.status(201).json({ msg: "User sukses ditambahkan" });
  } catch (error) {
    console.error(error.message);
  }
};

// export const registerUser = async (req, res) => {
//   const nama_lengkap_user = req.body.nama_lengkap_user;
//   const nama_user = req.body.nama_user;
//   const email_user = req.body.email_user;
//   const password_user = req.body.password_user;
//   let status_user = req.body.status_user;
//   let peran_user = req.body.peran_user;
//   let verifikasi_user = req.body.verifikasi_user;
//   const gambar_user = "default.webp";
//   const url = `${req.protocol}://${req.get("host")}/gambar/users/default.webp`;
//   try {
//     const hashPassword = await argon2.hash(password_user);
//     User.create({
//       nama_lengkap_user: nama_lengkap_user,
//       nama_user: nama_user,
//       email_user: email_user,
//       password_user: hashPassword,
//       gambar_user: gambar_user,
//       link_gambar_user: url,
//     }).then(async (data) => {
//       await UserData.create({
//         bbUserId: data.id,
//         status_user: status_user,
//         peran_user: peran_user,
//         verifikasi_user: verifikasi_user,
//       });
//     });

//     res.status(201).json({ msg: "User sukses ditambahkan" });
//   } catch (error) {
//     console.error(error.message);
//   }
// };

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "Data tidak ditemukan" });
  let fileName;
  let format;
  let data;

  const nama_lengkap_user = req.body.nama_lengkap_user;
  const nama_user = req.body.nama_user;
  const email_user = req.body.email_user;
  const password_user = req.body.password_user;
  let status_user = req.body.status_user;
  let peran_user = req.body.peran_user;
  let verifikasi_user = req.body.verifikasi_user;

  // if (
  //   peran_user !== "Admin" &&
  //   peran_user !== "Kontributor" &&
  //   peran_user !== "Pengguna"
  // )
  //   peran_user = "Pengguna";

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  // //SINI COK

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  // if (
  //   peran_user !== "Admin" &&
  //   peran_user !== "Kontributor" &&
  //   peran_user !== "Pengguna"
  // )
  //   peran_user = "Pengguna";

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  // //SINI COK

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  // if (
  //   peran_user !== "Admin" &&
  //   peran_user !== "Kontributor" &&
  //   peran_user !== "Pengguna"
  // )
  //   peran_user = "Pengguna";

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  // //SINI COK

  // if (
  //   verifikasi_user !== "Terverifikasi" &&
  //   verifikasi_user !== "Pending verifikasi" &&
  //   verifikasi_user !== "Belum terverifikasi"
  // )
  //   verifikasi_user = "Belum terverifikasi";

  if (req.files === null) {
    fileName = user.gambar_user;
    format = null;
    data = `./public/gambar/users/${fileName}.webp`;
  } else {
    const gambar = req.files.gambar_user;
    const ext = path.extname(gambar.name);
    const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
    if (!allowwedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Ekstensi gambar salah" });
    fileName = gambar.md5;
    data = req.files.gambar_user.data;
    fs.unlinkSync(`./public/gambar/users/${user.gambar_user}`);
    await sharp(data)
      .resize(400, 400)
      .toFile(`./public/gambar/users/${fileName}.webp`)
      .then((data) => {
        format = data.format;
      });
  }
  const url = `${req.protocol}://${req.get("host")}/gambar/users/${fileName}${
    format ? "." + format : ""
  }`;
  try {
    const hashPassword = await argon2.hash(password_user);
    await User.update(
      {
        nama_lengkap_user: nama_lengkap_user,
        nama_user: nama_user,
        email_user: email_user,
        password_user: hashPassword,
        status_user: status_user,
        peran_user: peran_user,
        verifikasi_user: verifikasi_user,
        gambar_user: `${fileName}${format ? "." + format : ""}`,
        link_gambar_user: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({ msg: "User sukses diperbaharui" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "Data tidak ditemukan" });
  try {
    const filePath = `./public/gambar/users/${user.gambar_user}`;
    fs.unlinkSync(filePath);
    await UserData.destroy({
      where: {
        bbUserId: req.params.id,
      },
    }).then(async () => {
      await User.destroy({
        where: {
          id: req.params.id,
        },
      });
    });
    // .then(async () => {
    //   await UserData.destroy({
    //     where: {
    //       bbUserId: req.params.id,
    //     },
    //   });
    // });
    res.status(200).json({ msg: "Data telah dihapus" });
  } catch (error) {
    console.error(error.message);
  }
};
