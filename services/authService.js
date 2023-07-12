const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./UserModel");

// Fungsi untuk menghasilkan token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Service untuk login
const login = async (email, password) => {
  try {
    // Cari pengguna berdasarkan email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email atau password salah");
    }

    // Verifikasi password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Email atau password salah");
    }

    // Generate token JWT
    const token = generateToken(user._id);

    // Simpan token ke pengguna
    user.token = token;
    await user.save();

    return { user, token };
  } catch (error) {
    console.error("Terjadi kesalahan saat login", error);
    throw new Error("Terjadi kesalahan saat login");
  }
};

// Service untuk registrasi
const register = async (namalengkap, email, password) => {
  try {
    // Cek apakah email sudah digunakan
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const user = new User({
      namalengkap,
      email,
      password: hashedPassword,
    });

    // Simpan pengguna ke database
    await user.save();

    // Generate token JWT
    const token = generateToken(user._id);

    // Simpan token ke pengguna
    user.token = token;
    await user.save();

    return { user, token };
  } catch (error) {
    console.error("Terjadi kesalahan saat registrasi", error);
    throw new Error("Terjadi kesalahan saat registrasi");
  }
};

module.exports = { login, register };
