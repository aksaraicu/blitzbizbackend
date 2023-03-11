"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListingWithRole = exports.updateListing = exports.getListingsAllWithRole = exports.getListings = exports.getListingByID = exports.deleteListingWithRole = exports.deleteListing = exports.createListing = void 0;
var _ListingModel = _interopRequireDefault(require("../models/ListingModel.js"));
var _ListingDataModel = _interopRequireDefault(require("../models/ListingDataModel.js"));
var _ListingLinkModel = _interopRequireDefault(require("../models/ListingLinkModel.js"));
var _sequelize = require("sequelize");
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _sharp = _interopRequireDefault(require("sharp"));
var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getListingsAllWithRole = async (req, res) => {
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  try {
    let response;
    if (role === "Admin") {
      console.log('role user adalah :: ' + role);
      const halaman = parseInt(req.query.halaman) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const cari = req.query.cari || "";
      const offset = limit * halaman;
      const totalBaris = await _ListingModel.default.count({
        where: {
          [_sequelize.Op.or]: [{
            nama_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            slogan_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            deskripsi_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }]
        }
      });
      //Pembulatan ke atas buat totalHalaman
      const totalHalaman = Math.ceil(totalBaris / limit);
      const hasil = await _ListingModel.default.findAll({
        attributes: {
          exclude: ["gambar_listing", "createdAt", "updatedAt", "bbUserId"]
        },
        include: [{
          model: _ListingDataModel.default,
          attributes: {
            exclude: ["createdAt", "updatedAt", "bbListingId"]
          }
        }, {
          model: _ListingLinkModel.default,
          attributes: {
            exclude: ["createdAt", "updatedAt", "bbListingId"]
          }
        }, {
          model: _UserModel.default,
          attributes: {
            exclude: ["createdAt", "gambar_user", "updatedAt", "bbListingId"]
          }
        }],
        where: {
          [_sequelize.Op.or]: [{
            nama_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            slogan_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            deskripsi_listing: {
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
      // end get listing with roleadmin
    } else {
      console.log('bukan admin');
      const halaman = parseInt(req.query.halaman) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const cari = req.query.cari || "";
      const offset = limit * halaman;
      const totalBaris = await _ListingModel.default.count({
        where: {
          [_sequelize.Op.or]: [{
            nama_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            slogan_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            deskripsi_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }],
          bbUserId: userId
        }
      });
      //Pembulatan ke atas buat totalHalaman
      const totalHalaman = Math.ceil(totalBaris / limit);
      const hasil = await _ListingModel.default.findAll({
        attributes: {
          exclude: ["gambar_listing", "createdAt", "updatedAt", "bbUserId"]
        },
        include: [{
          model: _ListingDataModel.default,
          attributes: {
            exclude: ["createdAt", "updatedAt", "bbListingId"]
          }
        }, {
          model: _ListingLinkModel.default,
          attributes: {
            exclude: ["createdAt", "updatedAt", "bbListingId"]
          }
        }, {
          model: _UserModel.default,
          attributes: {
            exclude: ["createdAt", "gambar_user", "updatedAt", "bbListingId"]
          }
        }],
        where: {
          [_sequelize.Op.or]: [{
            nama_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            slogan_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }, {
            deskripsi_listing: {
              [_sequelize.Op.like]: "%" + cari + "%"
            }
          }],
          bbUserId: userId
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
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};
exports.getListingsAllWithRole = getListingsAllWithRole;
const updateListingWithRole = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  try {
    if (role === "Admin") {
      console.log("ini admin");
      const listing = await _ListingModel.default.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!listing) return res.status(404).json({
        msg: "Data tidak ditemukan"
      });
      let fileName;
      let format;
      let data;
      const nama_listing = req.body.nama_listing;
      const slogan_listing = req.body.slogan_listing;
      const link_website_listing = req.body.link_website_listing;
      const link_kontak_listing = req.body.link_kontak_listing;
      const harga_listing = req.body.harga_listing;
      const deskripsi_listing = req.body.deskripsi_listing;
      const hasil_perbulan_listing = req.body.hasil_perbulan_listing;
      const pengeluaran_perbulan_listing = req.body.pengeluaran_perbulan_listing;
      const total_pengunjung_listing = req.body.total_pengunjung_listing;
      const pengguna_aktif_listing = req.body.pengguna_aktif_listing;
      const link_youtube_listing = req.body.link_youtube_listing;
      const status_listing = req.body.status_listing;
      if (req.files === null) {
        fileName = listing.gambar_listing;
        format = null;
        data = `./public/gambar/listings/${fileName}.webp`;
      } else {
        const gambar = req.files.gambar_listing;
        const ext = _path.default.extname(gambar.name);
        const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
        if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
          msg: "Ekstensi gambar salah"
        });
        fileName = gambar.md5;
        data = req.files.gambar_listing.data;
        _fs.default.unlinkSync(`./public/gambar/listings/${listing.gambar_listing}`);
        await (0, _sharp.default)(data).resize(1000, 480).toFile(`./public/gambar/listings/${fileName}.webp`).then(data => {
          format = data.format;
        });
      }
      const url = `${req.protocol}://${req.get("host")}/gambar/listings/${fileName}${format ? "." + format : ""}`;
      try {
        await _ListingModel.default.update({
          nama_listing: nama_listing,
          slogan_listing: slogan_listing,
          link_website_listing: link_website_listing,
          link_kontak_listing: link_kontak_listing,
          harga_listing: harga_listing,
          deskripsi_listing: deskripsi_listing,
          hasil_perbulan_listing: hasil_perbulan_listing,
          pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
          total_pengunjung_listing: total_pengunjung_listing,
          pengguna_aktif_listing: pengguna_aktif_listing,
          link_youtube_listing: link_youtube_listing,
          status_listing: status_listing,
          gambar_listing: `${fileName}${format ? "." + format : ""}`,
          link_gambar_listing: url
        }, {
          where: {
            id: req.params.id
          }
        });
        res.status(201).json({
          msg: "Listing sukses diperbarui"
        });
      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
      //end update listing with role admin
    } else {
      console.log('role user adalah :: ' + role);
      const post = await _ListingModel.default.findOne({
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
      const nama_listing = req.body.nama_listing;
      const slogan_listing = req.body.slogan_listing;
      const link_website_listing = req.body.link_website_listing;
      const link_kontak_listing = req.body.link_kontak_listing;
      const harga_listing = req.body.harga_listing;
      const deskripsi_listing = req.body.deskripsi_listing;
      const hasil_perbulan_listing = req.body.hasil_perbulan_listing;
      const pengeluaran_perbulan_listing = req.body.pengeluaran_perbulan_listing;
      const total_pengunjung_listing = req.body.total_pengunjung_listing;
      const pengguna_aktif_listing = req.body.pengguna_aktif_listing;
      const link_youtube_listing = req.body.link_youtube_listing;
      const status_listing = req.body.status_listing;
      if (req.files === null) {
        fileName = listing.gambar_listing;
        format = null;
        data = `./public/gambar/listings/${fileName}.webp`;
      } else {
        const gambar = req.files.gambar_listing;
        const ext = _path.default.extname(gambar.name);
        const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
        if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
          msg: "Ekstensi gambar salah"
        });
        fileName = gambar.md5;
        data = req.files.gambar_listing.data;
        _fs.default.unlinkSync(`./public/gambar/listings/${listing.gambar_listing}`);
        await (0, _sharp.default)(data).resize(1000, 480).toFile(`./public/gambar/listings/${fileName}.webp`).then(data => {
          format = data.format;
        });
      }
      const url = `${req.protocol}://${req.get("host")}/gambar/listings/${fileName}${format ? "." + format : ""}`;
      try {
        await _ListingModel.default.update({
          nama_listing: nama_listing,
          slogan_listing: slogan_listing,
          link_website_listing: link_website_listing,
          link_kontak_listing: link_kontak_listing,
          harga_listing: harga_listing,
          deskripsi_listing: deskripsi_listing,
          hasil_perbulan_listing: hasil_perbulan_listing,
          pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
          total_pengunjung_listing: total_pengunjung_listing,
          pengguna_aktif_listing: pengguna_aktif_listing,
          link_youtube_listing: link_youtube_listing,
          status_listing: status_listing,
          gambar_listing: `${fileName}${format ? "." + format : ""}`,
          link_gambar_listing: url
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
      //end update with role non admin
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};
exports.updateListingWithRole = updateListingWithRole;
const deleteListingWithRole = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  var userId = decoded.userId;
  var role = decoded.role;
  try {
    let response;
    if (role === "Admin") {
      console.log('role user adalah :: ' + role);
      const listing = await _ListingModel.default.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!listing) return res.status(404).json({
        msg: "Data tidak ditemukan"
      });
      try {
        const filePath = `./public/gambar/listings/${listing.gambar_listing}`;
        _fs.default.unlinkSync(filePath);
        await _ListingModel.default.destroy({
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
      const listing = await _ListingModel.default.findOne({
        where: {
          [_sequelize.Op.or]: [{
            id: req.params.id,
            bbUserId: userId
          }]
        }
      });
      if (!listing) return res.status(404).json({
        msg: "Data tidak ditemukan atau kamu gak punya akses menghapus"
      });
      try {
        const filePath = `./public/gambar/listings/${listing.gambar_listing}`;
        _fs.default.unlinkSync(filePath);
        await _ListingModel.default.destroy({
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
exports.deleteListingWithRole = deleteListingWithRole;
const getListings = async (req, res) => {
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const totalBaris = await _ListingModel.default.count({
    where: {
      [_sequelize.Op.or]: [{
        nama_listing: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        slogan_listing: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        deskripsi_listing: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }]
    }
  });
  //Pembulatan ke atas buat totalHalaman
  const totalHalaman = Math.ceil(totalBaris / limit);
  const hasil = await _ListingModel.default.findAll({
    attributes: {
      exclude: ["gambar_listing", "createdAt", "updatedAt", "bbUserId"]
    },
    include: [{
      model: _ListingDataModel.default,
      attributes: {
        exclude: ["createdAt", "updatedAt", "bbListingId"]
      }
    }, {
      model: _ListingLinkModel.default,
      attributes: {
        exclude: ["createdAt", "updatedAt", "bbListingId"]
      }
    }, {
      model: _UserModel.default,
      attributes: {
        exclude: ["createdAt", "gambar_user", "updatedAt", "bbListingId"]
      }
    }],
    where: {
      [_sequelize.Op.or]: [{
        nama_listing: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        slogan_listing: {
          [_sequelize.Op.like]: "%" + cari + "%"
        }
      }, {
        deskripsi_listing: {
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
exports.getListings = getListings;
const getListingByID = async (req, res) => {
  try {
    const response = await _ListingModel.default.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: _ListingDataModel.default
      }, {
        model: _ListingLinkModel.default
      }, {
        model: _UserModel.default
      }]
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
  }
};
exports.getListingByID = getListingByID;
const createListing = async (req, res) => {
  if (req.files === null) return res.status(400).json({
    msg: "Tidak ada file yang terunggah"
  });
  const nama_listing = req.body.nama_listing;
  const slogan_listing = req.body.slogan_listing;
  const link_website_listing = req.body.link_website_listing;
  const link_kontak_listing = req.body.link_kontak_listing;
  const harga_listing = req.body.harga_listing;
  const deskripsi_listing = req.body.deskripsi_listing;
  const hasil_perbulan_listing = req.body.hasil_perbulan_listing;
  const pengeluaran_perbulan_listing = req.body.pengeluaran_perbulan_listing;
  const total_pengunjung_listing = req.body.total_pengunjung_listing;
  const pengguna_aktif_listing = req.body.pengguna_aktif_listing;
  const link_youtube_listing = req.body.link_youtube_listing;
  const status_listing = req.body.status_listing;
  const gambar = req.files.gambar_listing;
  const ext = _path.default.extname(gambar.name);
  const fileName = gambar.md5;
  const data = req.files.gambar_listing.data;
  const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
  if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
    msg: "Ekstensi gambar salah"
  });
  let format;
  await (0, _sharp.default)(data).resize(1000, 480).toFile(`./public/gambar/listings/${fileName}.webp`).then(data => {
    format = data.format;
  });
  const url = `${req.protocol}://${req.get("host")}/gambar/listings/${fileName}.${format}`;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const decoded = _jsonwebtoken.default.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    var userId = decoded.userId;
    _ListingModel.default.create({
      nama_listing: nama_listing,
      slogan_listing: slogan_listing,
      harga_listing: harga_listing,
      deskripsi_listing: deskripsi_listing,
      status_listing: status_listing,
      gambar_listing: `${fileName}.${format}`,
      link_gambar_listing: url,
      bbUserId: userId
    }).then(data => {
      _ListingDataModel.default.create({
        bbListingId: data.id,
        hasil_perbulan_listing: hasil_perbulan_listing,
        pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
        total_pengunjung_listing: total_pengunjung_listing,
        pengguna_aktif_listing: pengguna_aktif_listing
      }).then(async data => {
        _ListingLinkModel.default.create({
          bbListingId: data.id,
          link_website_listing: link_website_listing,
          link_kontak_listing: link_kontak_listing,
          link_youtube_listing: link_youtube_listing
        });
      });
    });
    res.status(201).json({
      msg: "Listing sukses ditambahkan"
    });
  } catch (error) {
    console.error(error.message);
  }
};
exports.createListing = createListing;
const updateListing = async (req, res) => {
  const listing = await _ListingModel.default.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!listing) return res.status(404).json({
    msg: "Data tidak ditemukan"
  });
  let fileName;
  let format;
  let data;
  const nama_listing = req.body.nama_listing;
  const slogan_listing = req.body.slogan_listing;
  const link_website_listing = req.body.link_website_listing;
  const link_kontak_listing = req.body.link_kontak_listing;
  const harga_listing = req.body.harga_listing;
  const deskripsi_listing = req.body.deskripsi_listing;
  const hasil_perbulan_listing = req.body.hasil_perbulan_listing;
  const pengeluaran_perbulan_listing = req.body.pengeluaran_perbulan_listing;
  const total_pengunjung_listing = req.body.total_pengunjung_listing;
  const pengguna_aktif_listing = req.body.pengguna_aktif_listing;
  const link_youtube_listing = req.body.link_youtube_listing;
  const status_listing = req.body.status_listing;
  if (req.files === null) {
    fileName = listing.gambar_listing;
    format = null;
    data = `./public/gambar/listings/${fileName}.webp`;
  } else {
    const gambar = req.files.gambar_listing;
    const ext = _path.default.extname(gambar.name);
    const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
    if (!allowwedType.includes(ext.toLowerCase())) return res.status(422).json({
      msg: "Ekstensi gambar salah"
    });
    fileName = gambar.md5;
    data = req.files.gambar_listing.data;
    _fs.default.unlinkSync(`./public/gambar/listings/${listing.gambar_listing}`);
    await (0, _sharp.default)(data).resize(1000, 480).toFile(`./public/gambar/listings/${fileName}.webp`).then(data => {
      format = data.format;
    });
  }
  const url = `${req.protocol}://${req.get("host")}/gambar/listings/${fileName}${format ? "." + format : ""}`;
  try {
    await _ListingModel.default.update({
      nama_listing: nama_listing,
      slogan_listing: slogan_listing,
      // link_website_listing: link_website_listing,
      // link_kontak_listing: link_kontak_listing,
      harga_listing: harga_listing,
      deskripsi_listing: deskripsi_listing,
      // hasil_perbulan_listing: hasil_perbulan_listing,
      // pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
      // total_pengunjung_listing: total_pengunjung_listing,
      // pengguna_aktif_listing: pengguna_aktif_listing,

      // link_youtube_listing: link_youtube_listing,
      status_listing: status_listing,
      gambar_listing: `${fileName}${format ? "." + format : ""}`,
      link_gambar_listing: url
    }, {
      where: {
        id: req.params.id
      }
    }).then(() => {
      _ListingDataModel.default.update({
        hasil_perbulan_listing: hasil_perbulan_listing,
        pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
        total_pengunjung_listing: total_pengunjung_listing,
        pengguna_aktif_listing: pengguna_aktif_listing
      }, {
        where: {
          bbListingId: req.params.id
        }
      });
    }).then(async () => {
      _ListingLinkModel.default.update({
        link_website_listing: link_website_listing,
        link_kontak_listing: link_kontak_listing,
        link_youtube_listing: link_youtube_listing
      }, {
        where: {
          bbListingId: req.params.id
        }
      });
    });
    res.status(201).json({
      msg: "Listing sukses diperbarui"
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message
    });
  }
};
exports.updateListing = updateListing;
const deleteListing = async (req, res) => {
  const listing = await _ListingModel.default.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!listing) return res.status(404).json({
    msg: "Data tidak ditemukan"
  });
  try {
    const filePath = `./public/gambar/listings/${listing.gambar_listing}`;
    _fs.default.unlinkSync(filePath);
    await _ListingDataModel.default.destroy({
      where: {
        bbListingId: req.params.id
      }
    }).then(async () => {
      await _ListingLinkModel.default.destroy({
        where: {
          bbListingId: req.params.id
        }
      });
    }).then(async () => {
      await _ListingModel.default.destroy({
        where: {
          id: req.params.id
        }
      });
    });
    res.status(200).json({
      msg: "Data telah dihapus"
    });
  } catch (error) {
    console.error(error.message);
  }
};
exports.deleteListing = deleteListing;