import type { NextApiRequest, NextApiResponse } from "next";
import Pokedex from "../../../models/pokedex";
import Types from "../../../models/types";
import dbConnection from "../../../utils/db";
import fs from 'fs';
const zeroPad = (num: any, places: any) => String(num).padStart(places, "0");
export const config = {
  api: {
    bodyParser:{
      sizeLimit:'10mb'
    }
  },
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {

  await dbConnection()

  if (req.method === "GET") {
    try {      
      
      const pokedexData= await Pokedex.find().sort({id:-1});      
      const typesData = await Types.find();

      if (pokedexData && typesData  ) {  
        return res.send({
          status: true,
          pokedex: pokedexData,
          types:typesData
        });
      } else {
        return res.send({
          status: false,
        });
      }
    } catch (error: any) {
      console.warn(error);
      return res.status(200).send(error?.response?.data);
    }
  }else if (req.method === "POST"){

    const {type,search,pokemonType} = req.body;        

    
    if(type == 'filter'){
      const pokedexData: any = await Pokedex.find({type:pokemonType}).sort({id:-1});
      try {                  
  
        if (pokedexData ) {
          
          
          return res.send({
            status: true,
            pokedex: pokedexData,     
          });
        } else {
          return res.send({
            status: false,
          });
        }
      } catch (error: any) {
        console.warn(error);
        return res.status(200).send(error?.response?.data);
      }

    }else if(type== 'search'){
      const pokedexData: any = await Pokedex.find({$or:[{"name.english":{ $regex: `${search}.*`, $options: 'i' }},{"name.japanese":{ $regex: `/${search}/`, $options: 'i' }},{"name.chinese":{ $regex: `/${search}/`, $options: 'i' }},{"name.french":{ $regex: `/${search}/`, $options: 'i' }}]});
        try {            
      
          
          if (pokedexData ) {
                          
            
            return res.send({
              status: true,
              pokedex: pokedexData,     
            });
          } else {
            return res.send({
              status: false,
            });
          }
        } catch (error: any) {
          console.warn(error);
          return res.status(200).send(error?.response?.data);
        }

    }else if(type == 'add'){
      try {            
        const {pokemonInfo,baseInfo,pokemonTypes,base64,imageExtension}= req.body;
        
        const getLastId = await Pokedex.find().sort({id:-1}).limit(1);

        const data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');
        await fs.writeFileSync(`./public/pokemon-images/${getLastId[0].id + 1}.${imageExtension}`, data);

        const storePokemon = new Pokedex({
          id:getLastId[0].id + 1,
          name:pokemonInfo,
          type:pokemonTypes,
          base:baseInfo
        });

        if(storePokemon.save()){
          return res.send({
            status: true,            
          });
        }else{
          return res.send({
            status: false,            
          });
        }
      
      } catch (error: any) {
        console.warn(error);
        console.log(error);
        return res.status(200).send(error?.response?.data);
      }
    }else if(type== 'update'){
      try {            
        const {pokemonInfo,baseInfo,pokemonTypes,id,base64,imageExtension}= req.body;
        
                
        const data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');
        await fs.writeFileSync(`./public/pokemon-images/${zeroPad(id,3)}.${imageExtension}`, data);

        const updatePokemon = await Pokedex.findOneAndUpdate({id:id},{
          $set:{
          id:id,
          name:pokemonInfo,
          type:pokemonTypes,
          base:baseInfo
          }
      });

        if(updatePokemon){
          return res.send({
            status: true,            
          });
        }else{
          return res.send({
            status: false,            
          });
        }
      
      } catch (error: any) {
        console.warn(error);
        return res.status(200).send(error?.response?.data);
      }
    }else if(type== 'remove'){
      try {            
        const {id}= req.body;
        
                
        const removePokemon = await Pokedex.deleteOne({id:id});

        if(removePokemon){
          return res.send({
            status: true,            
          });
        }else{
          return res.send({
            status: false,            
          });
        }
      
      } catch (error: any) {
        console.warn(error);
        return res.status(200).send(error?.response?.data);
      }

    }

    

  }
}
