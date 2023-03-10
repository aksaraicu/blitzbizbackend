import User from "../models/UserModel.js";
import UserData from "../models/UserDataModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    const email_user = req.body.email_user;
    const user = await User.findOne({
      where: {
        email_user: email_user,
      },
      include: [
        {
          model: UserData,
          attributes: ["peran_user"],
        },
      ],
    });
    if (!user) return res.status(404).json({ msg: `user tidak ditemukan` });
    // console.log(user.password_user)
    const match = await argon2.verify(
      user.password_user,
      req.body.password_user
    );
    // console.log(match)
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    // res.status(200).json({msg: "Cocok nih Password"});
    const userId = user.id;
    const name = user.nama_user;
    const email = user.email_user;
    const role = user.bb_user_datum.peran_user;
    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log(req.cookies.refreshToken)
  if (!refreshToken) return res.sendStatus(204);
  const decoded = jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  var email = decoded.email;
  const user = await User.findOne({
    where: {
      email_user: email,
    },
  });
  if (!user) return res.sendStatus(204);
  res.clearCookie("refreshToken");
  return res.status(200).json({ msg: "Sukses Logout" });
};

export const Me = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  const decoded = jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  var userId = decoded.userId;
  var email_user = decoded.email;
  console.log(email_user);

  const user = await User.findOne({
    attributes: ["id", "nama_user", "email_user", "link_gambar_user"],
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
  res.status(200).json(user);
};


// export const ForgotPassword = async (req, res) => {
//     const email = req.body.email
//     try {
//       const user = await User.findOne({
//         attributes: ["id", "nama_user", "email_user", "reset_password_link"],
//         where: {
//           email_user: email,
//         }
//       })
//       console.log(user)
//       return res.status(200).json(user)

//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
   

// };

export const ForgotPassword = async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({
      attributes: ["id", "nama_user", "email_user", "reset_password_link"],
      where: {
        email_user: email,
      }
    })

  if(!user) {
    return res.status(401).json({
      status: false,
      message: 'Email tidak tersedia'
    })
  }
    // console.log(user.id)
    const token = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
    // console.log(token)

    await User.update(
      { reset_password_link: token },
      {
        where: {
          email_user: req.body.email,
        },
      }
    );

    const isiEmail = {
      from: "Blitbiz Portal",
      to: email_tujuan,
      subject: "Link Password Blitbiz Anda",
      html: `<p>Silahkan link di bawah ini untuk reset password Blitbiz Anda</p>
             <p>${process.env.CLIENT_URL}/resetpassword/</p>`
    }

    return res.status(200).json({
      status: true,
      message: req.body.email
    })

  } 

  
 

