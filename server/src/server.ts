import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

const port=Number(process.env.PORT)||5000;
if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Set it in the hosting provider environment.');
if(process.env.NODE_ENV==='production'&&!process.env.CLIENT_ORIGIN) {
  throw new Error('Set CLIENT_ORIGIN to the deployed frontend origin before starting in production.');
}

await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000,maxPoolSize:10});
const server=app.listen(port,'0.0.0.0',()=>console.log(JSON.stringify({level:'info',event:'server_started',port,environment:process.env.NODE_ENV||'development'})));

let shuttingDown=false;
async function shutdown(signal:string){
  if(shuttingDown)return;
  shuttingDown=true;
  console.log(JSON.stringify({level:'info',event:'shutdown_started',signal}));
  const forceTimer=setTimeout(()=>process.exit(1),10000);
  forceTimer.unref();
  server.close(async()=>{try{await mongoose.disconnect();clearTimeout(forceTimer);process.exit(0);}catch{process.exit(1);}});
}
process.on('SIGTERM',()=>void shutdown('SIGTERM'));
process.on('SIGINT',()=>void shutdown('SIGINT'));
