export const imageValidator = async () => {
    if (req.files === null)
      return res.status(400).json({ msg: "Tidak ada file yang terunggah" });
  };
  
  export const imageAllowedTypes = async () => {
    if (!allowwedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Ekstensi gambar salah" });
  };