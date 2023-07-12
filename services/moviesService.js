require("dotenv").config();
const Movies = require("../models/moviesModels");
const { Storage } = require("@google-cloud/storage");
// const express = require("express");
// const app = express();
// app.use(express.static("./something.json"));
const storageBucket = "moviesdata"; // Ganti dengan nama bucket penyimpanan Anda di GCP
const gcStorage = new Storage({
  // credentials: {
  //   type: "service_account",
  //   project_id: "backend-microservices-392205",
  //   private_key_id: "c675d6beb52a02ed2e082ca2a2ddf90830c40a8c",
  //   private_key:
  //     "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUPIyW4KKlCecW\nNRd6wZr7TYR0TBUS3QOTQBjPINozH9iSvnTKh0QcscJYsrsNpmDYte9j9A6Lh+D9\nMH2cbflw8RzX/HyghOslxfLsKIZdrYtpxrMndrFejw91H2yuIKb6Zhct2ma3pT9W\nfEqmR/dbOHsXWy4gh5MFp4V6JJlhMaAkcpywv+bq4QG1GVwjVl9nqYuXKxdIy3lO\nIVK6IF2aidenF5u7GkjWaR4Z86k5Q65WXTHm6lzEepdMaJBwDdfqMajaLgN9qWqS\n4e8xg5nJ5lrfhu3Ax6RKdeAj4v7qE+grI6ePs073mDk+4cyNEezt0NFGus0aVmZE\nsTiKkdmTAgMBAAECggEAFQTcHZMouHSXHMVsSl2DNlEyhXwFeEVINdyauGS2B2sn\nfTz8fxRPZBIcv8EPsmXgYIYAK+N/T0VJPHoBbq0bj5ppc2CPjSwsx6RnjwjiacOm\ns3aYxpdEMKu1abGPh103fEQBFqrzEkv8zlln4TjuX+vjkOgYVONoZZ52Iycdw5jC\n2RrLd7G3X8LsClUn2moeabkrtosK2hyoqRKwAnlsTbcXnfCOmUFmrzIlnWR2WVj5\nKn65gGskvPXI31FNvfu9Zanqrf60t6cr94nvCQ1OChhYwA48P4OkPCeeKWTsA5mp\ni1LSZ3wdmdFiQduHZji5CwelatzaZ52Vw4QynVnczQKBgQD2D/x1KZ7D8Rz2kJDV\nm/re0pzWgcUQv3UFBXifDhqvlmWXYgSUyZ4mm/o9XqxyY86JHk4qPiJHhIkFQW++\npcKLNdwM3p0A8VH58V1GgPTv8Q2ViiOo8GUYwyCzzTksqPjahKBLXCA15iXLwA3q\nIVddyqYEMNM77capynh3cvvVdQKBgQDcztcez8FPF7rwr8bHHNg+x28PJD0MlbPS\nsw98MKZCCZvEicagPjhGkgqBOHcCOa/5FZcqPpjnZOFi05F/haVFqvRZ0l+er5t5\nH1fKWq2VJNEqIdFM/Qm2Ez1+z9OiO4SEJ8BAAgO93EyUdHFtKzdTBHQ0itIKcMb6\n2fMYFIKp5wKBgQCQm1Z/uIUAnEusL8uebbuihd38Rml87TelStDXkN9n/5gWvlj4\n5ABYqmQG+wOXekZf2PqQ4tEcfKxV9V3pidrqGy4GNjHI4wmNPSbXD2RjOqQEFRnd\n5+FSCyLF6D7Im0kcisL1Zt/bLTVbJ7RFu3Bvw2+LmPIbDyMol7/yWxXbHQKBgQCO\nPqVwkO/8LtJb+TC51ogsMTgHbhXyBIKaioXAQGrqgdwaCZOuaUbBl5Uy15g7E8Sc\nVt9R9I92CZP0oUzK9OKadd4B+zdkN8aVia55il7mhJhGZxC5Yw0dgVmNVv8ENQlS\nRXVhBqs4ZTHkNPtZE40JawYdTwyucyaMNVmYOqZOIwKBgQC++dLq7QIjXQsUCY+h\n/Nk9WEtTi6mr1vgXvrhna00M9JsSKMPpxLaoys64fZdw0iPrPhDd4pPdqblHyiYY\nSQZigLuXd7M+1oaK9WC4lzGtkBlj8LAdhoRxMtjG2/gYjKtb8td7VMzreKxi/2Sh\n+X5G7ti8tXYGVEVsDLc+iegxxA==\n-----END PRIVATE KEY-----\n",
  //   client_email: "movies@backend-microservices-392205.iam.gserviceaccount.com",
  //   client_id: "115831179147705735293",
  //   auth_uri: "https://accounts.google.com/o/oauth2/auth",
  //   token_uri: "https://oauth2.googleapis.com/token",
  //   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  //   client_x509_cert_url:
  //     "https://www.googleapis.com/robot/v1/metadata/x509/movies%40backend-microservices-392205.iam.gserviceaccount.com",
  //   universe_domain: "googleapis.com",
  // },
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
