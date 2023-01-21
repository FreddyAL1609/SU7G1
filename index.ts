import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';



dotenv.config();
// Iniciando el cliente
const prisma = new PrismaClient();


const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

app.get('/home', (req: Request, res: Response) => {
  res.send('-> Hola');
});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}/home`);
});

/// USERS ///
// POST: Creamos la ruta /api/v1/users, para insertar nuevos usuarios mediante postman
app.post("/api/v1/users", async (req:Request , res:Response) => {
  const { name, email, password } = req.body;
  const hashed = await hash(password,10)
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      passwordHash: hashed,
     
    },
  });
  res.json(user);
});


// Creamos la ruta /api/v1/logusers, para loguear los usuarios creados mediante postman


// Creamos la ruta /api/v1/showusers, para mostrar los usuarios creados mediante postman
app.get("/api/v1/showusers", async (req:Request, res:Response) => {
  const user = await prisma.user.findMany(
    {
      select:{
        id:true,
        name:true,
        email:true,
        passwordHash:false,
      }
    }
  );
  res.json(user);
});

/// SONGS ///

// Creamos la ruta "/api/v1/songs", para crear nuevas canciones mediante postman.
app.post("/api/v1/songs", async (req:Request , res:Response) => {
  const { name, artist, album,year,genre, duration, isPublic } = req.body;
  const song = await prisma.song.create({
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
});



// GET: Creamos la ruta "/api/v1/songs", para mostrar todas las canciones creadas mediante postman
app.get("/api/v1/songs", async (req:Request, res:Response) => {
  const songs = await prisma.song.findMany(
    {
      select:{
        id:true,
        name: true,
        isPublic:true,
        artist: true,
        album: true,
        year: true,
        genre: true,
        duration: true,
      }
    }
  );
  res.json(songs);
});


// GET: Creamos la ruta "/api/v1/songs/:id", para mostrar una cancion  según su ID.
app.get("/api/v1/songs/:id", async (req:Request, res:Response) => {
  const { id } = req.params
  const songs = await prisma.song.findUnique(
    {
      where: {
        id: parseInt(id)
      }
    }
  );
    res.json(songs);
  });