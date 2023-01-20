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

// Creamos la ruta /api/v1/users, para insertar nuevos usuarios mediante postman
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


// Creamos la ruta /api/v1/showusers, para mostrar los usuarios creados mediante postman
app.get("/api/v1/showusers", async (req:Request, res:Response) => {
  const user = await prisma.user.findMany(
    {
      select:{
        id:true,
        name:true,
        email:true,
        passwordHash:true,
      }
    }
  );
  res.json(user);
});
