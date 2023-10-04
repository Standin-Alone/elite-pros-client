const fs = require('fs/promises');
const path = require('path');
module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    try{    
      const filePath = path.join(process.cwd()+ '/public', 'types.json');
      const getFile = await fs.readFile(filePath);

    if(getFile){
     
      const cleanData = JSON.parse(getFile);  
      const insertData = await db.collection('types').insertMany(cleanData);

      if(insertData){
        console.log("successfully migrated the types");
      }

    }
  }catch(error){
    console.warn(error);
  }

  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
