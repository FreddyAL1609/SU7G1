import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

app.get('/home', (req: Request, res: Response) => {
  res.send('-> Hola');
});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}/home`);
});