const express = require("express");
const multer = require("multer");
const moviesService = require("../services/moviesService");

const router = express.Router();
const upload = multer();

router.post( "/",  upload.fields([{ name: "image" }, { name: "movies" }]),
  async (req, res) => {
    try {
      const { nama, deskripsi, tanggal, genre } = req.body;
      const { image, movies } = req.files;

      const moviesData = {
        nama,
        deskripsi,
        tanggal,
        genre,
        image: image[0],
        movies: movies[0],
      };

      const newmovies = await moviesService.createmovies(moviesData);

      res.status(201).json({ message: "movies berhasil ditambahkan", newmovies });
    } catch (error) {
      console.error("Terjadi kesalahan", error);
      res.status(500).json({ error: "Terjadi kesalahan" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const movies = await moviesService.getmovies();
    res.json(movies);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.get("/:moviesId", async (req, res) => {
  try {
    const { moviesId } = req.params;
    const movies = await moviesService.getmoviesById(moviesId);

    if (!movies) {
      return res.status(404).json({ error: "movies tidak ditemukan" });
    }

    res.json(movies);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.put(
  "/:moviesId",
  upload.fields([{ name: "image" }, { name: "movies" }]),
  async (req, res) => {
    try {
      const { moviesId } = req.params;
      const { nama, deskripsi, tanggal, genre } = req.body;
      const { image, movies } = req.files;

      const moviesData = {
        nama,
        deskripsi,
        tanggal,
        genre,
        image: image ? image[0] : undefined,
        movies: movies ? movies[0] : undefined,
      };

      const updatedMovies = await moviesService.updatemovies(
        moviesId,
        moviesData
      );

      res.json({
        message: "movies berhasil diperbarui",
        movies: updatedMovies,
      });
    } catch (error) {
      console.error("Terjadi kesalahan", error);
      res.status(500).json({ error: "Terjadi kesalahan" });
    }
  }
);

router.delete("/:moviesId", async (req, res) => {
  try {
    const { moviesId } = req.params;
    const movies = await moviesService.getmoviesById(moviesId);

    if (!movies) {
      return res.status(404).json({ error: "movies tidak ditemukan" });
    }

    await moviesService.deletemovies(moviesId);

    res.json({ message: "movies berhasil dihapus", movies });
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

module.exports = router;
