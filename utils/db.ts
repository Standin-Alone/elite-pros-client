import mongoose from 'mongoose';

const DB: string = process.env.DB as string;

async function dbConnection() {
  await mongoose
    .connect(DB)
    .then(() => {
      console.log('Connection Successfull');      
    })
    .catch((err) => {      
      console.log(err);
    });
}

export default dbConnection;
