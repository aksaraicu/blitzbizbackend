import Listing from "../models/ListingModel.js";
import ListingData from "../models/ListingDataModel.js";
import ListingLink from "../models/ListingLinkModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import Users from "../models/UserModel.js";

import jwt from "jsonwebtoken"

export const getListingsAllWithRole = async (req, res) =>{
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);  
  var userId = decoded.userId 
  var role = decoded.role 
  
  try {
      let response;
      if(role === "Admin"){
        console.log('role user adalah :: ' + role )
        const halaman = parseInt(req.query.halaman) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const cari = req.query.cari || "";
        const offset = limit * halaman;
        const totalBaris = await Listing.count({
          where: {
            [Op.or]: [
              {
                nama_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                slogan_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                deskripsi_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
            ],
          },
        });
        //Pembulatan ke atas buat totalHalaman
        const totalHalaman = Math.ceil(totalBaris / limit);
        const hasil = await Listing.findAll({
          attributes: {
            exclude: [ "gambar_listing", "createdAt", "updatedAt", "bbUserId"],
          },
          include: [
            {
              model: ListingData,
              attributes: {
                exclude: ["createdAt", "updatedAt", "bbListingId"],
              },
            },
            {
              model: ListingLink,
              attributes: {
                exclude: ["createdAt", "updatedAt", "bbListingId"],
              },
            },
            {
              model: Users,
              attributes: {
                exclude: ["createdAt", "gambar_user", "updatedAt", "bbListingId"],
              },
            },
          ],
          where: {
            [Op.or]: [
              {
                nama_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                slogan_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                deskripsi_listing: {
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
      // end get listing with roleadmin
      }else{
        console.log('bukan admin')
        const halaman = parseInt(req.query.halaman) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const cari = req.query.cari || "";
        const offset = limit * halaman;
        const totalBaris = await Listing.count({
          where: {
            [Op.or]: [
              {
                nama_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                slogan_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                deskripsi_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
            ],
            bbUserId: userId
          },
        });
        //Pembulatan ke atas buat totalHalaman
        const totalHalaman = Math.ceil(totalBaris / limit);
        const hasil = await Listing.findAll({
          attributes: {
            exclude: ["gambar_listing", "createdAt", "updatedAt", "bbUserId"],
          },
          include: [
            {
              model: ListingData,
              attributes: {
                exclude: ["createdAt", "updatedAt", "bbListingId"],
              },
            },
            {
              model: ListingLink,
              attributes: {
                exclude: [ "createdAt", "updatedAt", "bbListingId"],
              },
            },
            {
              model: Users,
              attributes: {
                exclude: ["createdAt", "gambar_user", "updatedAt", "bbListingId"],
              },
            },
          ],
          where: {
            [Op.or]: [
              {
                nama_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                slogan_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
              {
                deskripsi_listing: {
                  [Op.like]: "%" + cari + "%",
                },
              },
            ],
            bbUserId: userId
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
      }
      return res.status(200).json(response);
  } catch (error) {
      res.status(500).json({msg: error.message});
  }
}


export const updateListingWithRole = async (req, res) =>{
  
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);  
  var userId = decoded.userId 
  var role = decoded.role 
  
  try {
      
      if(role === "Admin"){
        console.log("ini admin")
        const listing = await Listing.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (!listing) return res.status(404).json({ msg: "Data tidak ditemukan" });
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
          const ext = path.extname(gambar.name);
          const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
          if (!allowwedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: "Ekstensi gambar salah" });
          fileName = gambar.md5;
          data = req.files.gambar_listing.data;
          fs.unlinkSync(`./public/gambar/listings/${listing.gambar_listing}`);
      
          await sharp(data)
            .resize(1000, 480)
            .toFile(`./public/gambar/listings/${fileName}.webp`)
            .then((data) => {
              format = data.format;
            });
        }
        const url = `${req.protocol}://${req.get(
          "host"
        )}/gambar/listings/${fileName}${format ? "." + format : ""}`;
        try {
          await Listing.update(
            {
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
              link_gambar_listing: url,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          );
          res.status(201).json({ msg: "Listing sukses diperbarui" });
        } catch (error) {
          res.status(400).json({ msg: error.message });
        }
      //end update listing with role admin
      }else{
        console.log('role user adalah :: ' + role )
        const post = await Listing.findOne({
          where: {
            [Op.or]: 
            [
              {
              id: req.params.id,          
              bbUserId: userId
              }
            ],
          },
        });
        if (!post) return res.status(404).json({ msg: "Data tidak ditemukan atau user tidak punya hak mengubah" });
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
          const ext = path.extname(gambar.name);
          const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
          if (!allowwedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: "Ekstensi gambar salah" });
          fileName = gambar.md5;
          data = req.files.gambar_listing.data;
          fs.unlinkSync(`./public/gambar/listings/${listing.gambar_listing}`);
      
          await sharp(data)
            .resize(1000, 480)
            .toFile(`./public/gambar/listings/${fileName}.webp`)
            .then((data) => {
              format = data.format;
            });
        }
        const url = `${req.protocol}://${req.get(
          "host"
        )}/gambar/listings/${fileName}${format ? "." + format : ""}`;
        try {
          await Listing.update(
            {
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
              link_gambar_listing: url,
            },
            {
              where: {
                [Op.or]: 
                  [
                    {
                    id: req.params.id,
                    bbUserId: userId
                    }
                  ],
                            
              },
            }
          );
          return res.status(201).json({ msg: ('Post sukses diubah oleh user: ' + userId)  });
        } catch (error) {
          res.status(400).json({ msg: error.message });
        }
        //end update with role non admin
      }
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({msg: error.message});
  }
}

export const deleteListingWithRole = async (req, res) =>{
  
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);  
  var userId = decoded.userId 
  var role = decoded.role 
  
  try {
      let response;
      if(role === "Admin"){
        console.log('role user adalah :: ' + role )
        const listing = await Listing.findOne({
          where: {
              id: req.params.id, 
          },
        });
        if (!listing) return res.status(404).json({ msg: "Data tidak ditemukan" });
        try {
          const filePath = `./public/gambar/listings/${listing.gambar_listing}`;
          fs.unlinkSync(filePath);
          await Listing.destroy({
            where: {
                id: req.params.id,  
            },
          });
          return res.status(200).json({ msg: "Data telah dihapus" });
        } catch (error) {
          console.error(error.message);
        }
      }else{
        console.log('role user adalah :: ' + role )
        const listing = await Listing.findOne({
          where: {
            [Op.or]: 
            [
              {
              id: req.params.id,          
              bbUserId: userId
              }
            ],            
          },
        });
        if (!listing) return res.status(404).json({ msg: "Data tidak ditemukan atau kamu gak punya akses menghapus" });
        try {
          const filePath = `./public/gambar/listings/${listing.gambar_listing}`;
          fs.unlinkSync(filePath);
          await Listing.destroy({
            where: {
              [Op.or]: 
              [
                {
                id: req.params.id,          
                bbUserId: userId
                }
              ],
              
            },
          });
          return res.status(200).json({ msg: "Data telah dihapus" });
        } catch (error) {
          console.error(error.message);
        }
      }
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({msg: error.message});
  }
}




export const getListings = async (req, res) => {
  const halaman = parseInt(req.query.halaman) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const cari = req.query.cari || "";
  const offset = limit * halaman;
  const totalBaris = await Listing.count({
    where: {
      [Op.or]: [
        {
          nama_listing: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          slogan_listing: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          deskripsi_listing: {
            [Op.like]: "%" + cari + "%",
          },
        },
      ],
    },
  });
  //Pembulatan ke atas buat totalHalaman
  const totalHalaman = Math.ceil(totalBaris / limit);
  const hasil = await Listing.findAll({
    attributes: {
      exclude: ["gambar_listing", "createdAt", "updatedAt", "bbUserId"],
    },
    include: [
      {
        model: ListingData,
        attributes: {
          exclude: ["createdAt", "updatedAt", "bbListingId"],
        },
      },
      {
        model: ListingLink,
        attributes: {
          exclude: ["createdAt", "updatedAt", "bbListingId"],
        },
      },
      {
        model: Users,
        attributes: {
          exclude: ["createdAt", "gambar_user", "updatedAt", "bbListingId"],
        },
      },
    ],
    where: {
      [Op.or]: [
        {
          nama_listing: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          slogan_listing: {
            [Op.like]: "%" + cari + "%",
          },
        },
        {
          deskripsi_listing: {
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

export const getListingByID = async (req, res) => {
  try {
    const response = await Listing.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: ListingData,
        },
        {
          model: ListingLink,
        },
        {
          model: Users,
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
  }
};

export const createListing = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada file yang terunggah" });

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

  const ext = path.extname(gambar.name);
  const fileName = gambar.md5;
  const data = req.files.gambar_listing.data;
  const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];

  if (!allowwedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Ekstensi gambar salah" });

  let format;

  await sharp(data)
    .resize(1000, 480)
    .toFile(`./public/gambar/listings/${fileName}.webp`)
    .then((data) => {
      format = data.format;
    });

  const url = `${req.protocol}://${req.get(
    "host"
  )}/gambar/listings/${fileName}.${format}`;

  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);  
    var userId = decoded.userId 
    Listing.create({
      nama_listing: nama_listing,
      slogan_listing: slogan_listing,
      harga_listing: harga_listing,
      deskripsi_listing: deskripsi_listing,
      status_listing: status_listing,
      gambar_listing: `${fileName}.${format}`,
      link_gambar_listing: url,
      bbUserId: userId,
    }).then((data) => {
      ListingData.create({
        bbListingId: data.id,
        hasil_perbulan_listing: hasil_perbulan_listing,
        pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
        total_pengunjung_listing: total_pengunjung_listing,
        pengguna_aktif_listing: pengguna_aktif_listing,
      }).then(async (data) => {
        ListingLink.create({
          bbListingId: data.id,
          link_website_listing: link_website_listing,
          link_kontak_listing: link_kontak_listing,
          link_youtube_listing: link_youtube_listing,
        });
      });
    });

    res.status(201).json({ msg: "Listing sukses ditambahkan" });
  } catch (error) {
    console.error(error.message);
  }
};

export const updateListing = async (req, res) => {
  const listing = await Listing.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!listing) return res.status(404).json({ msg: "Data tidak ditemukan" });
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
    const ext = path.extname(gambar.name);
    const allowwedType = [".png", ".jpg", ".jpeg", ".webp"];
    if (!allowwedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Ekstensi gambar salah" });
    fileName = gambar.md5;
    data = req.files.gambar_listing.data;
    fs.unlinkSync(`./public/gambar/listings/${listing.gambar_listing}`);

    await sharp(data)
      .resize(1000, 480)
      .toFile(`./public/gambar/listings/${fileName}.webp`)
      .then((data) => {
        format = data.format;
      });
  }
  const url = `${req.protocol}://${req.get(
    "host"
  )}/gambar/listings/${fileName}${format ? "." + format : ""}`;
  try {
    await Listing.update(
      {
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
        link_gambar_listing: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() => {
        ListingData.update(
          {
            hasil_perbulan_listing: hasil_perbulan_listing,
            pengeluaran_perbulan_listing: pengeluaran_perbulan_listing,
            total_pengunjung_listing: total_pengunjung_listing,
            pengguna_aktif_listing: pengguna_aktif_listing,
          },
          {
            where: {
              bbListingId: req.params.id,
            },
          }
        );
      })
      .then(async () => {
        ListingLink.update(
          {
            link_website_listing: link_website_listing,
            link_kontak_listing: link_kontak_listing,
            link_youtube_listing: link_youtube_listing,
          },
          {
            where: {
              bbListingId: req.params.id,
            },
          }
        );
      });
    res.status(201).json({ msg: "Listing sukses diperbarui" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteListing = async (req, res) => {
  const listing = await Listing.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!listing) return res.status(404).json({ msg: "Data tidak ditemukan" });
  try {
    const filePath = `./public/gambar/listings/${listing.gambar_listing}`;
    fs.unlinkSync(filePath);
    await ListingData.destroy({
      where: {
        bbListingId: req.params.id,
      },
    })
      .then(async () => {
        await ListingLink.destroy({
          where: {
            bbListingId: req.params.id,
          },
        });
      })
      .then(async () => {
        await Listing.destroy({
          where: {
            id: req.params.id,
          },
        });
      });
    res.status(200).json({ msg: "Data telah dihapus" });
  } catch (error) {
    console.error(error.message);
  }
};
