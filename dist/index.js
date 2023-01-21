"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
dotenv_1.default.config();
// Iniciando el cliente
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.get('/home', (req, res) => {
    res.send('-> Hola');
});
app.listen(port, () => {
    console.log(`El servidor se ejecuta en http://localhost:${port}/home`);
});
/// USERS ///
// Creamos la ruta /api/v1/users, para insertar nuevos usuarios mediante postman
app.post("/api/v1/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const hashed = yield (0, bcrypt_1.hash)(password, 10);
    const user = yield prisma.user.create({
        data: {
            name: name,
            email: email,
            passwordHash: hashed,
        },
    });
    res.json(user);
}));
// Creamos la ruta /api/v1/logusers, para loguear los usuarios creados mediante postman
// Creamos la ruta /api/v1/showusers, para mostrar los usuarios creados mediante postman
app.get("/api/v1/showusers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            passwordHash: false,
        }
    });
    res.json(user);
}));
/// SONGS ///
// Creamos la ruta "/api/v1/songs", para crear nuevas canciones mediante postman.
app.post("/api/v1/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genre, duration, isPublic } = req.body;
    const song = yield prisma.song.create({
        data: {
            name: name,
            isPublic: isPublic,
            artist: artist,
            album: album,
            year: year,
            genre: genre,
            duration: duration,
        },
    });
    res.json(song);
}));
// GET: Creamos la ruta "/api/v1/songs", para mostrar todas las canciones creadas mediante postman
app.get("/api/v1/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.song.findMany({
        select: {
            id: true,
            name: true,
            isPublic: true,
            artist: true,
            album: true,
            year: true,
            genre: true,
            duration: true,
        }
    });
    res.json(songs);
}));
// GET: Creamos la ruta "/api/v1/songs/:id", para mostrar una cancion  según su ID.
app.get("/api/v1/songs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const songs = yield prisma.song.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    res.json(songs);
}));
/// PLAY LIST /// 
// GET: Creamos la ruta "/api/v1/playlist ", para añadir una canción a PlayList.
app.post("/api/v1/playlists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, userId, songIds } = req.body;
    const playlist = yield prisma.playlist.create({
        data: {
            name: name,
            userId: userId,
            songs: { connect: songIds.map((id) => { return { id: parseInt(id) }; }) },
        },
    });
    const PlaylistSongs = yield prisma.playlist.findUnique({
        where: {
            id: playlist.id,
        },
        include: {
            songs: true,
        },
    });
    res.json(PlaylistSongs);
}));
app.get("/api/v1/playlists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playlist = yield prisma.playlist.findMany({
        select: {
            id: true,
            name: true,
            userId: true,
            songs: true,
        }
    });
    res.json(playlist);
}));
