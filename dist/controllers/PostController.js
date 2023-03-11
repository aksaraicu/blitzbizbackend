"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePostByRole = exports.updatePost = exports.getPosts = exports.getPostByID = exports.getPostAllbyRole = exports.deletePostWithRole = exports.deletePost = exports.createPost = void 0;
var _PostModel = _interopRequireDefault(require("../models/PostModel.js"));
var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));
var _sequelize = require("sequelize");
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _sharp = _interopRequireDefault(require("sharp"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// export const getPostAllWithRole = async (req, res) =>{

//   const refreshToken = req.cookies.refreshToken;
//   // console.log(req.cookies.refreshToken)
//   if(!refreshToken) return res.sendStatus(204);
//   const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);  
//   var userId = decoded.userId 
//   var role = decoded.role 
//   // console.log(req.bb_user_datum.peran_user)
//   try {
//       let response;
//       if(role === "Admin"){
//         console.log("iniadmin")
//           response = await Post.findAll({
//               attributes:['id','judul','isi', 'bbUserId'],
//               include:[{
//                   model: User,
//                   attributes:['nama_user','email_user']
//               }]
//           });
//       }else{
//         console.log('bukan admin')
//           response = await Post.findAll({
//               attributes:['id','judul','isi'],
//               where:{
//                   bbUserId: userId
//               },
//               include:[{
//                   model: User,
//                   attributes:['nama_user','email_user']
//               }]
//           });
//       }
//       res.status(200).json(response);
//   } catch (error) {
//       res.status(500).json({msg: error.message});
//   }
// }

const getPostAllbyRole = async (req, res) => {
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const totalBaris = await _PostModel.default.count({
    where: {
      [_sequelize.Op.or]: [{
        judul: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        kategori: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }]
    }
  });
  //Pembulatan ke atas buat totalHalaman
  const totalHalaman = Math.ceil(totalBaris / limit);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  try {
    let response;
    if (role === "Admin") {
      console.log('role user adalah :: ' + role);
      response = await _PostModel.default.findAll({
        attributes: {
          exclude: ["bbUserId", "createdAt", "updatedAt"]
        },
        include: {
          model: _UserModel.default,
          attributes: {
            exclude: ["password", "id", "password_user", "gambar_user", "createdAt", "updatedAt"]
          }
        },
        where: {
          [_sequelize.Op.or]: [{
            judul: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            kategori: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }]
        },
        offset: offset,
        limit: limit
        // order: [["id", "DESC"]],
      });
    } else {
      console.log('role user adalah :: ' + role);
      response = await _PostModel.default.findAll({
        attributes: {
          exclude: ["bbUserId", "createdAt", "updatedAt"]
        },
        include: {
          model: _UserModel.default,
          attributes: {
            exclude: ["password", "id", "password_user", "gambar_user", "createdAt", "updatedAt"]
          }
        },
        where: {
          [_sequelize.Op.or]: [{
            judul: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            kategori: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }],
          bbUserId: userId
        },
        offset: offset,
        limit: limit
        // order: [["id", "DESC"]],
      });
    }

    res.status(200).json({
      hasil: response,
      halaman: halaman,
      limit: limit,
      totalBaris: totalBaris,
      totalHalaman: totalHalaman
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};
exports.getPostAllbyRole = getPostAllbyRole;
const updatePostByRole = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  try {
    if (role === "Admin") {
      console.log('role user adalah :: ' + role);
      const post = await _PostModel.default.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!post) return res.status(404).json({
        msg: "Data tidak ditemukan"
      });
      let fileName;
      let format;
      let data;
      const judul = req.body.judul;
      const isi = req.body.isi;
      const kategori = req.body.kategori;
      if (req.files === null) {
        fileName = post.gambar;
        format = null;
        data = `./public/gambar/posts/${fileName}.webp`;
      } else {
        const gambar = req.files.gambar;
        const ext = _path.default.extname(gambar.name);
        const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
        if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
          msg: "Ekstensi gambar salah"
        });
        fileName = gambar.md5;
        data = req.files.gambar.data;
        _fs.default.unlinkSync(`./public/gambar/posts/${post.gambar}`);
        await (0, _sharp.default)(data).resize(400, 400).toFile(`./public/gambar/posts/${fileName}.webp`).then(data => {
          format = data.format;
        });
      }
      const url = `${req.protocol}://${req.get("host")}/gambar/posts/${fileName}${format ? "." + format : ""}`;
      try {
        await _PostModel.default.update({
          judul: judul,
          isi: isi,
          kategori: kategori,
          gambar: `${fileName}${format ? "." + format : ""}`,
          url: url
        }, {
          where: {
            id: req.params.id
          }
        });
        res.status(201).json({
          msg: "Post sukses diubah"
        });
      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
    } else {
      console.log('role user adalah :: ' + role);
      const post = await _PostModel.default.findOne({
        where: {
          [_sequelize.Op.or]: [{
            id: req.params.id,
            bbUserId: userId
          }]
        }
      });
      if (!post) return res.status(404).json({
        msg: "Data tidak ditemukan atau user tidak punya hak mengubah"
      });
      let fileName;
      let format;
      let data;
      const judul = req.body.judul;
      const isi = req.body.isi;
      const kategori = req.body.kategori;
      if (req.files === null) {
        fileName = post.gambar;
        format = null;
        data = `./public/gambar/posts/${fileName}.webp`;
      } else {
        const gambar = req.files.gambar;
        const ext = _path.default.extname(gambar.name);
        const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
        if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
          msg: "Ekstensi gambar salah"
        });
        fileName = gambar.md5;
        data = req.files.gambar.data;
        _fs.default.unlinkSync(`./public/gambar/posts/${post.gambar}`);
        await (0, _sharp.default)(data).resize(400, 400).toFile(`./public/gambar/posts/${fileName}.webp`).then(data => {
          format = data.format;
        });
      }
      const url = `${req.protocol}://${req.get("host")}/gambar/posts/${fileName}${format ? "." + format : ""}`;
      try {
        await _PostModel.default.update({
          judul: judul,
          isi: isi,
          kategori: kategori,
          gambar: `${fileName}${format ? "." + format : ""}`,
          url: url
        }, {
          where: {
            [_sequelize.Op.or]: [{
              id: req.params.id,
              bbUserId: userId
            }]
          }
        });
        return res.status(201).json({
          msg: 'Post sukses diubah oleh user: ' + userId
        });
      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};
exports.updatePostByRole = updatePostByRole;
const deletePostWithRole = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  try {
    if (role === "Admin") {
      console.log('role user adalah :: ' + role);
      const post = await _PostModel.default.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!post) return res.status(404).json({
        msg: "Data tidak ditemukan"
      });
      try {
        const filePath = `./public/gambar/posts/${post.gambar}`;
        _fs.default.unlinkSync(filePath);
        await _PostModel.default.destroy({
          where: {
            id: req.params.id
          }
        });
        return res.status(200).json({
          msg: "Data telah dihapus"
        });
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log('role user adalah :: ' + role);
      const post = await _PostModel.default.findOne({
        where: {
          [_sequelize.Op.or]: [{
            id: req.params.id,
            bbUserId: userId
          }]
        }
      });
      if (!post) return res.status(404).json({
        msg: "Data tidak ditemukan atau kamu gak punya akses menghapus"
      });
      try {
        const filePath = `./public/gambar/posts/${post.gambar}`;
        _fs.default.unlinkSync(filePath);
        await _PostModel.default.destroy({
          where: {
            [_sequelize.Op.or]: [{
              id: req.params.id,
              bbUserId: userId
            }]
          }
        });
        return res.status(200).json({
          msg: "Data telah dihapus"
        });
      } catch (error) {
        console.error(error.message);
      }
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};
exports.deletePostWithRole = deletePostWithRole;
const getPosts = async (req, res) => {
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const totalBaris = await _PostModel.default.count({
    where: {
      [_sequelize.Op.or]: [{
        judul: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        kategori: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }]
    }
  });
  //Pembulatan ke atas buat totalHalaman
  const totalHalaman = Math.ceil(totalBaris / limit);
  const hasil = await _PostModel.default.findAll({
    attributes: {
      exclude: ["bbUserId", "createdAt", "updatedAt"]
    },
    include: {
      model: _UserModel.default,
      attributes: {
        exclude: ["password", "id", "password_user", "gambar_user", "createdAt", "updatedAt"]
      }
    },
    where: {
      [_sequelize.Op.or]: [{
        judul: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        kategori: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }]
    },
    offset: offset,
    limit: limit
    // order: [["id", "DESC"]],
  });

  res.json({
    hasil: hasil,
    halaman: halaman,
    limit: limit,
    totalBaris: totalBaris,
    totalHalaman: totalHalaman
  });
};
exports.getPosts = getPosts;
const getPostByID = async (req, res) => {
  try {
    const response = await _PostModel.default.findOne({
      where: {
        id: req.params.id
      }
    });
    res.json(response);
  } catch (error) {
    console.error(error.message);
  }
};
exports.getPostByID = getPostByID;
const createPost = async (req, res) => {
  if (req.files === null) return res.status(400).json({
    msg: "Tidak ada file yang terunggah"
  });
  const judul = req.body.judul;
  const isi = req.body.isi;
  const kategori = req.body.kategori;
  const gambar = req.files.gambar;
  const ext = _path.default.extname(gambar.name);
  const fileName = gambar.md5;
  const data = req.files.gambar.data;
  const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
  if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
    msg: "Ekstensi gambar salah"
  });
  let format;
  await (0, _sharp.default)(data).resize(400, 400).toFile(`./public/gambar/posts/${fileName}.webp`).then(data => {
    format = data.format;
  });
  const url = `${req.protocol}://${req.get("host")}/gambar/posts/${fileName}.${format}`;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    var userId = decoded.userId;
    // console.log(userId)
    await _PostModel.default.create({
      judul: judul,
      isi: isi,
      kategori: kategori,
      gambar: `${fileName}.${format}`,
      url: url,
      bbUserId: userId
    });
    res.status(201).json({
      msg: "Post added successfully"
    });
  } catch (error) {
    console.error(error.message);
  }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
  const post = await _PostModel.default.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!post) return res.status(404).json({
    msg: "Data tidak ditemukan"
  });
  let fileName;
  let format;
  let data;
  const judul = req.body.judul;
  const isi = req.body.isi;
  const kategori = req.body.kategori;
  if (req.files === null) {
    fileName = post.gambar;
    format = null;
    data = `./public/gambar/posts/${fileName}.webp`;
  } else {
    const gambar = req.files.gambar;
    const ext = _path.default.extname(gambar.name);
    const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
    if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
      msg: "Ekstensi gambar salah"
    });
    fileName = gambar.md5;
    data = req.files.gambar.data;
    _fs.default.unlinkSync(`./public/gambar/posts/${post.gambar}`);
    await (0, _sharp.default)(data).resize(400, 400).toFile(`./public/gambar/posts/${fileName}.webp`).then(data => {
      format = data.format;
    });
  }
  const url = `${req.protocol}://${req.get("host")}/gambar/posts/${fileName}${format ? "." + format : ""}`;
  try {
    await _PostModel.default.update({
      judul: judul,
      isi: isi,
      kategori: kategori,
      gambar: `${fileName}${format ? "." + format : ""}`,
      url: url
    }, {
      where: {
        id: req.params.id
      }
    });
    res.status(201).json({
      msg: "Post sukses diubah"
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message
    });
  }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
  const post = await _PostModel.default.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!post) return res.status(404).json({
    msg: "Data tidak ditemukan"
  });
  try {
    const filePath = `./public/gambar/posts/${post.gambar}`;
    _fs.default.unlinkSync(filePath);
    await _PostModel.default.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({
      msg: "Data telah dihapus"
    });
  } catch (error) {
    console.error(error.message);
  }
};
exports.deletePost = deletePost;