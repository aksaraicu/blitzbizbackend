import User from "../models/UserModel.js";
import UserData from "../models/UserDataModel.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  const decoded = jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  var email = decoded.email;

  // console.log(decoded)
  const user = await User.findOne({
    where: {
      email_user: email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  var role = decoded.role;
  next();
};

export const isAdmin = async (req, res, next) => {
  const decoded = jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  var userId = decoded.userId;
  var role = decoded.role;
  console.log(role);
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: [
      {
        model: UserData,
        attributes: ["peran_user"],
      },
    ],
  });

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (role !== "Admin") return res.status(403).json({ msg: role });

  next();
};

export const isKontributor = async (req, res, next) => {
  const decoded = jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  var userId = decoded.userId;
  var role = decoded.role;
  console.log(role);
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: [
      {
        model: UserData,
        attributes: ["peran_user"],
      },
    ],
  });

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (role !== "Kontributor")
    return res.status(403).json({ msg: "Akses terlarang" });

  next();
};
