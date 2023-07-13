require("dotenv").config();
const Movies = require("../models/moviesModels");
const { Storage } = require("@google-cloud/storage");
// const express = require("express");
// const app = express();
// app.use(express.static("./something.json"));
const storageBucket = "moviesdata"; // Ganti dengan nama bucket penyimpanan Anda di GCP
const gcStorage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ganti dengan lokasi kunci akses JSON Anda
  projectId: "backend-microservices-392205", // Ganti dengan ID proyek GCP Anda
});

const createmovies = async (moviesData) => {
  try {
    const { nama, deskripsi, tanggal, genre, image, movies } = moviesData;

    // Upload file gambar ke Google Cloud Storage
    const imageBucket = gcStorage.bucket("moviesdata"); // Ganti dengan nama bucket penyimpanan gambar
    const imageFileName = `images/${Date.now()}_${image.originalname}`; // Menyertakan nama folder "datamovie" di dalam nama file
    const imageFile = imageBucket.file(imageFileName);

    const imageStream = imageFile.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });

    await new Promise((resolve, reject) => {
      imageStream.on("error", (error) => {
        console.error("Gagal mengunggah gambar", error);
        reject("Gagal mengunggah gambar");
      });

      imageStream.on("finish", () => {
        resolve();
      });

      imageStream.end(image.buffer);
    });

    // Upload file movies ke Google Cloud Storage
    const moviesBucket = gcStorage.bucket("moviesdata"); // Ganti dengan nama bucket penyimpanan movies
    const moviesFileName = `movies/${Date.now()}_${movies.originalname}`; // Menyertakan nama folder "datamovie" di dalam nama file
    const moviesFile = moviesBucket.file(moviesFileName);

    const moviesStream = moviesFile.createWriteStream({
      metadata: {
        contentType: movies.mimetype,
      },
    });

    await new Promise((resolve, reject) => {
      moviesStream.on("error", (error) => {
        console.error("Gagal mengunggah movies", error);
        reject("Gagal mengunggah movies");
      });

      moviesStream.on("finish", () => {
        resolve();
      });

      moviesStream.end(movies.buffer);
    });

    // Simpan data movies ke MongoDB
    const newmovies = new Movies({
      nama,
      deskripsi,
      tanggal,
      genre,
      image: `https://storage.googleapis.com/moviesdata/${imageFileName}`,
      movies: `https://storage.googleapis.com/moviesdata/${moviesFileName}`,
    });

    await newmovies.save();

    return newmovies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};
const getmovies = async () => {
  try {
    const movies = await Movies.find();
    return movies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const getmoviesById = async (moviesId) => {
  try {
    const movies = await Movies.findById(moviesId);
    return movies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const updatemovies = async (moviesId, moviesData) => {
  try {
    const { nama, deskripsi, tanggal, genre, image, movies } = moviesData;
    const newmovies = await Movies.findById(moviesId);

    if (!newmovies) {
      throw new Error("movies tidak ditemukan");
    }

    // Hapus file gambar lama jika ada perubahan gambar
    if (image) {
      if (newmovies.image) {
        const imageBucket = gcStorage.bucket("moviesdata");
        const imageFileName = newmovies.image.split("/").pop();
        const imageFile = imageBucket.file(`images/${imageFileName}`); // Menggunakan folder "images" di dalam nama file

        // Hapus file gambar lama jika ada di folder
        if (await imageFile.exists()) {
          await imageFile.delete();
        }
      }
    }

    // Hapus file movies lama jika ada perubahan movies
    if (movies) {
      if (newmovies.movies) {
        const moviesBucket = gcStorage.bucket("moviesdata");
        const moviesFileName = newmovies.movies.split("/").pop();
        const moviesFile = moviesBucket.file(`movies/${moviesFileName}`); // Menggunakan folder "movies" di dalam nama file

        // Hapus file movies lama jika ada di folder
        if (await moviesFile.exists()) {
          await moviesFile.delete();
        }
      }
    }

    // Perbarui file gambar jika ada perubahan
    let imageUpdated = newmovies.image;
    if (image) {
      const imageBucket = gcStorage.bucket("moviesdata");
      const imageFileName = `images/${Date.now()}_${image.originalname}`;
      const imageFile = imageBucket.file(imageFileName);

      const imageStream = imageFile.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        imageStream.on("error", (error) => {
          console.error("Gagal mengunggah gambar", error);
          reject("Gagal mengunggah gambar");
        });

        imageStream.on("finish", () => {
          resolve();
        });

        imageStream.end(image.buffer);
      });

      imageUpdated = `https://storage.googleapis.com/moviesdata/${imageFileName}`;
    }

    // Perbarui file movies jika ada perubahan
    let moviesUpdated = newmovies.movies;
    if (movies) {
      const moviesBucket = gcStorage.bucket("moviesdata");
      const moviesFileName = `movies/${Date.now()}_${movies.originalname}`;
      const moviesFile = moviesBucket.file(moviesFileName);

      const moviesStream = moviesFile.createWriteStream({
        metadata: {
          contentType: movies.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        moviesStream.on("error", (error) => {
          console.error("Gagal mengunggah movies", error);
          reject("Gagal mengunggah movies");
        });

        moviesStream.on("finish", () => {
          resolve();
        });

        moviesStream.end(movies.buffer);
      });

      moviesUpdated = `https://storage.googleapis.com/moviesdata/${moviesFileName}`;
    }

    // Perbarui data movies di MongoDB
    newmovies.nama = nama || newmovies.nama;
    newmovies.deskripsi = deskripsi || newmovies.deskripsi;
    newmovies.tanggal = tanggal || newmovies.tanggal;
    newmovies.genre = genre || newmovies.genre;
    newmovies.image = imageUpdated;
    newmovies.movies = moviesUpdated;

    await newmovies.save();

    return newmovies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const deletemovies = async (moviesId) => {
  try {
    await Movies.findByIdAndDelete(moviesId);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

module.exports = {
  createmovies,
  getmovies,
  getmoviesById,
  updatemovies,
  deletemovies,
};
