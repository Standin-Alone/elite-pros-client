import Image from "next/image";
import EditIcon from '@mui/icons-material/Edit';

const zeroPad = (num: any, places: any) => String(num).padStart(places, "0");

export const PokemonCard = ({ data,lang,handleOpenModal}: any) => {

  return (
    <div
      className="container shadow-2xl  duration-500 hover:shadow-orange-500 duration-200  rounded h-full"
      role="button"
    >
      <div>

      
        <Image
          src={`/pokemon-images/${zeroPad(data.id, 3)}.png`}
          className="mx-auto object-fit"
          alt="error image"
          width={200}
          height={200}
          key={`/pokemon-images/${zeroPad(data.id, 3)}.png`}
          loading="eager"
          loader={({src}:any)=>src}
          unoptimized={true}
          priority
          layout="responsive"
        />
   
      </div>
      <div className=" container  py-10 px-10">
        <p>
          <span className="mr-1 font-bold">Name:</span> <span className="font-bold text-orange-500">{data.name[lang == "en" ? 'english' : lang == "fra" ? 'french' :  lang == "jp" ? 'japanese'  :  lang == "cn" ? 'chinese' : "english" ]}</span>
        </p>
        <div className="flex">
          <div className="mr-5">
            <p>Type:</p>
          </div>

          <div>
            <ul className="list-disc list-inside">
              {data.type.map((item: any) => {
                return <li>{item}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="flex">
          <div className="mr-5">
            <p>Base:</p>
          </div>

          <div>
            <ul className="list-disc list-inside">
              {Object.keys(data.base).map((key: any) => {
                return <li>{key}: {data.base[key]}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="flex mt-10">
            <button type="button"  onClick={()=>handleOpenModal("update",data)}   className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" >              
              <EditIcon fontSize="medium" /> Update</button>
        </div>
      </div>
    </div>
  );
};
