const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

// Route untuk login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password); // Mengubah AuthService menjadi authService
    res.json({ message: "anda berhasil login", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route untuk registrasi
router.post("/register", async (req, res) => {
  try {
    const { namalengkap, email, password } = req.body;
    const { user, token } = await authService.register(
      namalengkap,
      email,
      password
    ); // Mengubah AuthService menjadi authService
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
