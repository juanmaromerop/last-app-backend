import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { setupSwagger } from './tests/swagger.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT||3000;
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Conectado a la base de datos");
})
.catch(error => {
    console.error("Error en conectar a la base de datos", error);
    
})


app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter)

setupSwagger(app)

export default app

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
