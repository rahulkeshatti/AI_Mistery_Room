import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

const port=Number(process.env.PORT)||5000;
if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Set it in server/.env.');
await mongoose.connect(process.env.MONGODB_URI);
app.listen(port,()=>console.log(`AI Mystery Room API listening on ${port}`));
