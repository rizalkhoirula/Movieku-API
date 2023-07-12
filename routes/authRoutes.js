const express = require("express");
const router = express.Router();
const AuthService = require("./AuthService");

// Route untuk login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route untuk registrasi
router.post("/register", async (req, res) => {
  try {
    const { namalengkap, email, password } = req.body;
    const { user, token } = await AuthService.register(
      namalengkap,
      email,
      password
    );
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
