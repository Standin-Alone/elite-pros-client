import mongoose from 'mongoose';

const pokedex = new mongoose.Schema(
  {
    id:{
        type:Number
    },
    name:{
        type:Object
    },
    type:{
        type:Array
    },
    base:{
        type:Object
    }
  },
  { strict: false }
);

const Pokedex =
  mongoose.models.Pokedex ||
  mongoose.model('Pokedex', pokedex);
export default Pokedex;
