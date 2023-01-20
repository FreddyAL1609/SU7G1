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
// Creamos la ruta /api/v1/showusers, para mostrar los usuarios creados mediante postman
app.get("/api/v1/showusers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
        }
    });
    res.json(user);
}));
