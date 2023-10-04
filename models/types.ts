import mongoose from 'mongoose';

const types = new mongoose.Schema(
  {   
    english:{
        type:String
    },
    chinese:{
        type:String
    },
    japanese:{
        type:String
    }
  },
  { strict: false }
);

const Types =
  mongoose.models.Types ||
  mongoose.model('Types', types);
export default Types;
