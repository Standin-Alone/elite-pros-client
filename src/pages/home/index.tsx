import axios from "axios";
import { useEffect, useState,useRef } from "react";
import Grid from "@mui/material/Grid";
import { PokemonCard } from "@/components/card";
import { SkeletonLoader } from "@/components/skeleton";
import { SearchInput } from "@/components/search";
import { useRouter } from 'next/router'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CustomModal } from "@/components/modal";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Swal from 'sweetalert2'
import { Modal } from 'flowbite';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Image from "next/image";

const zeroPad = (num: any, places: any) => String(num).padStart(places, "0");


const Home = ({params}:any) => {
  const [pokedex, setPokedex] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  const [id, setId] = useState<any>("");  
  const [base64Image, setBase64] = useState<any>("");  
  const [filterType, setFilterType] = useState<any>([]);  
  const [actionType, setActionType] = useState<any>('add');  
  const [searchVal, setSearchVal] = useState<any>('');
  const [loading, setLoading] = useState<any>(true);
  const [modal,setModal] = useState<any>({});
  const router = useRouter()
  const {type} = router.query;  


  useEffect(()=>{
    const targetId = document.getElementById('mainModal');
    const myModal = new Modal(targetId);
    setModal(myModal);

  },[]);


  
  const getPokedex = async () => {
    setLoading(true);      
    let getPokedex = await axios.get(`/api/pokedex?type=${type ?? 'en'}`);
    if (getPokedex.status == 200) {
      setLoading(false);      
      setPokedex(getPokedex.data.pokedex);
      setTypes(getPokedex.data.types);
    } else {
      setLoading(false);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const { initTE, Collapse } = await import("tw-elements");
      initTE({ Collapse });
    };
    init();
    setTimeout(() => {
      getPokedex();
    }, 1000);
  }, []);


  const handleSearch = async ()=>{      
    if(searchVal){
      setLoading(true); 
      let body ={
        search:searchVal,
        type:'search'
      }
      setTimeout(async ()=>{
        let getPokedex = await axios.post("/api/pokedex",body);
        if (getPokedex.status == 200) {
          setLoading(false);      
          setPokedex(getPokedex.data.pokedex);
        } else {
          setLoading(false);
          alert("Something went wrong.");
        }
      },1000)
    
    }else{

    }
  }

  const handleTypeChange = async(typeValue:any)=>{
    if(typeValue){
      setLoading(true); 
      let body ={
        pokemonType:typeValue,
        type:'filter'
      }
      setFilterType(typeValue);

      setTimeout(async ()=>{
        let filterByTypePokedex = await axios.post("/api/pokedex",body);
        if (filterByTypePokedex.status == 200) {
          setLoading(false);      
          setPokedex(filterByTypePokedex.data.pokedex);
        } else {
          setLoading(false);
          alert("Something went wrong.");
        }
      },1000)
    
    }else{

    }
  }


  const clearInput = ()=>{
    formik.resetForm();    
  }

  const handleCloseModal = ()=>{
    modal.hide();
  }

  const handleOpenModal = (type:any,data:any)=>{    
    modal.show();    
      
    if(type === 'update'){      
      setId(data.id);
      
      formik.setFieldValue('id',data.id);
      setBase64(`/pokemon-images/${zeroPad(data.id, 3)}.png`);
   
      Object.keys(data).map( (key:any)=>{
      if(key == 'base' || key == 'name'){
          Object.keys(data[key]).map( (baseKey:any)=>{    
              
             formik.setFieldValue(`${key == 'base' ? 'baseInfo' :'pokemonInfo'}['${baseKey}']`,data[key][baseKey])             
             setTimeout(() => formik.setFieldTouched(`${key == 'base' ? 'baseInfo' :'pokemonInfo'}['${baseKey}']`, false,false));
          })                    
        }else if (key == 'type'){
           formik.setFieldValue(`pokemonTypes`,data[key]);
        }
      });
    }else{
      clearInput();     
    }
    
    setActionType(type);
    formik.setFieldValue('type',type);
  }

  const validationSchema =  Yup.object({
    image:Yup.mixed().test("fileSize", "The file size should be 25MB below.", (value:any) => {      
      return value && (value.size <= 25000000)
  })
  .test("type", "Only the following formats are accepted: .jpeg, .jpg, png", (value:any) => {
      return (value && (
          value.type === "image/jpeg" ||          
          value.type === "image/png"         
      ))
  }),
    pokemonInfo: Yup.object().shape({
      english: Yup.string().required('This field is required.'),
      japanese: Yup.string().required('This field is required.'),
      chinese: Yup.string().required('This field is required.'),
      french: Yup.string().required('This field is required.'),            
    }),
    baseInfo: Yup.object().shape({
        HP:Yup.number().typeError("This field should be numeric type only.").required('This field is required.'),  
        Attack:Yup.number().typeError("This field should be numeric type only.").required('This field is required.'),  
        Defense:Yup.number().typeError("This field should be numeric type only.").required('This field is required.'),  
        "Sp. Attack":Yup.number().typeError("This field should be numeric type only.").required('This field is required.'),  
        "Sp. Defense":Yup.number().typeError("This field should be numeric type only.").required('This field is required.'),  
        Speed:Yup.number().typeError("This field should be numeric type only.").required('This field is required.'),  
    }),
    pokemonTypes: Yup.array().required('This field is required.'),        
  });

  const initialValues = {
    image:'',
    base64:'',
    pokemonInfo:{english:'',japanese:'',chinese:'',french:''},
    baseInfo:{HP:'',Attack:'',Defense:'','Sp. Attack':'','Sp. Defense':'',Speed:''},    
    id:'',
    type:'',
    pokemonTypes:[]
  } 
  
  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };


  const handleSubmit =  async (values:any)=>{

    if(actionType == "add"){

      const base64 = await toBase64(values.image as File);

      values.base64 = base64;
      let imageExtension = values.image.name.split('.')[1];
      values.imageExtension = imageExtension;
      Swal.fire({
        title: 'Do you want to save this record of pokemon?',
        confirmButtonText: 'Yes, Save It!',
        denyButtonText: `No`,
        showDenyButton:true
      }).then(async(result) => {     
        if (result.isConfirmed) {    
          const storePokemon = await axios.post("/api/pokedex",values);
          if(storePokemon.data.status == true){           
            Swal.fire(
              'Message',
              'Successfully Saved!',
              'success'
            )
            window.location.reload();         
          }else{
            Swal.fire(
              'Message',
              'Something went wrong.',
              'error'
            )
          }
        }           
      })
    }else if(actionType == "update"){
     

      const base64 = await toBase64(values.image as File);

      values.base64 = base64;
      let imageExtension = values.image.name.split('.')[1];
      values.imageExtension = imageExtension;
      values.type = 'update';

      

      Swal.fire({
        title: 'Do you want to update this record of pokemon?',
        confirmButtonText: 'Yes, Update It!',
        denyButtonText: `No`,
        showDenyButton:true
      }).then(async(result) => {     
        if (result.isConfirmed) {    
          const storePokemon = await axios.post("/api/pokedex",values);
          if(storePokemon.data.status == true){
            Swal.fire(
              'Message',
              'Successfully Updated!',
              'success'
            )
            window.location.reload();
          }else{
            Swal.fire(
              'Message',
              'Something went wrong.',
              'error'
            )
          }
        }           
      })
    }

    
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit:handleSubmit
  })


  const handleSelectChange = async (event:any)=>{
    const {
      target: { value },
    } = event;
 

    formik.setFieldValue('pokemonTypes',   typeof value === 'string' ? value.split(',') : value);
  }

  

  const handleRemoveRecord = ()=>{
    let body = {
      type:'remove',
      id:id
    }
    Swal.fire({
      title: 'Do you want to remove this record of pokemon?',
      confirmButtonText: 'Yes, Remove It!',
      denyButtonText: `No`,
      showDenyButton:true
    }).then(async(result) => {     
      if (result.isConfirmed) {    
        const storePokemon = await axios.post("/api/pokedex",body);
        if(storePokemon.data.status == true){
          Swal.fire(
            'Message',
            'Successfully Removed!',
            'success'
          )
          getPokedex();
          clearInput();
          modal.hide();
        }else{
          Swal.fire(
            'Message',
            'Something went wrong.',
            'error'
          )
        }
      }           
    })
  }


  



  return (
    <div className="w-fit h-fit mx-60 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 h-fit mt-10">
      <div className="mb-10">
        <h1 className="font-bold text-1xl ">Pokedex</h1>
        <small className="font-bold">Here are the list of Pokemons</small>
      </div>

      <div className="my-5">       
        <button type="button"  className="text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={()=>handleOpenModal("add",[])}>
          <AddCircleIcon />Add New Pokemon
        </button>
      </div>

      <div>
        <SearchInput dropdownData={types} onSearch={handleSearch} onChange={(e:any)=>setSearchVal(e.target.value)} onTypeChange={handleTypeChange} lang={type} selectedType={filterType}/>        
      </div>

      {!loading ? (
        <Grid container spacing={4} my={10}  columns={{ xs: 4, sm: 8, md: 12 }}>
          {pokedex.map(function (item: any, index: any) {
            return (
              <Grid item sm={4} key={index}>
                <PokemonCard data={item}  lang={type} handleOpenModal={handleOpenModal} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <>
          <br></br>
          <br></br>
          <SkeletonLoader />
        </>
      )}
      <button className="hide" data-te-collapse-init="true"></button>
      <CustomModal
        title={"Add New Pokemon"}
        body={          
          <form onSubmit={handleSubmit}>
          <div>
            {base64Image &&
               <Image
               src={base64Image ?? ''}
               className="mx-auto object-fit mb-10"
               alt="error image"
               width={400}
               height={400}
               priority={false}
             />
            }
           
          </div>
          <p className="font-bold">Pokemon Information</p>      
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
              <input onChange={async(event:any)=> {
                const base64 = await toBase64(event.target.files[0] as File);
                setBase64(base64);
                formik.setFieldValue("image", event.target.files[0])}}  type="file" name="image" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name of pokemon in english..." required/>
              {formik.touched.image && formik.errors.image && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.image}
                </p>
              )}
          </div>

          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">English Name</label>
              <input onChange={formik.handleChange} value={formik.values?.pokemonInfo?.english} type="text" name="pokemonInfo.english" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name of pokemon in english..." required/>
              {formik.touched.pokemonInfo?.english && formik.errors.pokemonInfo?.english && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.pokemonInfo?.english}
                </p>
              )}
          </div>
          <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chinese Name</label>
              <input onChange={formik.handleChange} value={formik.values.pokemonInfo?.chinese} type="text" name="pokemonInfo.chinese" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name of pokemon in chinese..." required/>
              {formik.touched.pokemonInfo?.chinese && formik.errors.pokemonInfo?.chinese && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.pokemonInfo?.chinese}
                </p>
              )}
          </div>
          <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Japanese Name</label>
              <input onChange={formik.handleChange} value={formik.values.pokemonInfo?.japanese} type="text" name="pokemonInfo.japanese" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name of pokemon in japanese..." required/>
              {formik.touched.pokemonInfo?.japanese && formik.errors.pokemonInfo?.japanese && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.pokemonInfo?.japanese}
                </p>
              )}
          </div>
          <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">French Name</label>
              <input onChange={formik.handleChange} value={formik.values.pokemonInfo?.french} type="text" name="pokemonInfo.french" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name of pokemon in french..." required/>
              {formik.touched.pokemonInfo?.french && formik.errors.pokemonInfo?.french && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.pokemonInfo?.french}
                </p>
              )}
          </div>
          
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"> Types</label>
              <Select
              className="block"
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={formik.values.pokemonTypes}
                  onChange={handleSelectChange}
                  input={<OutlinedInput label="Name" />}                  
                >
                  {types.map((name:any,index:any) => (
                    <MenuItem
                      key={index}
                      value={name[type == "en" ? 'english' : type == "fra" ? 'french' :  type == "jp" ? 'japanese'  :  type == "cn" ? 'chinese' : "english" ]}           
                    >
                      {name[type == "en" ? 'english' : type == "fra" ? 'french' :  type == "jp" ? 'japanese'  :  type == "cn" ? 'chinese' : "english" ]}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.pokemonTypes && formik.errors.pokemonTypes && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.pokemonTypes}
                </p>
              )}
          </div>

          <p className="font-bold mt-10">Base Information</p>
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">HP</label>
              <input onChange={formik.handleChange} value={formik.values.baseInfo?.HP}  type="text" name="baseInfo.HP"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="health power..." required/>
              {formik.touched.baseInfo?.HP && formik.errors.baseInfo?.HP && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.baseInfo?.HP}
                </p>
              )}
          </div>
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Attack</label>
              <input  onChange={formik.handleChange} value={formik.values.baseInfo?.Attack}   type="text" name="baseInfo.Attack"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="attack power" required/>
              {formik.touched.baseInfo?.Attack && formik.errors.baseInfo?.Attack && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.baseInfo?.Attack}
                </p>
              )}
          </div>
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Defense</label>
              <input  onChange={formik.handleChange}  value={formik.values.baseInfo?.Defense}  type="text" name="baseInfo.Defense"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="defense" required/>
              {formik.touched.baseInfo?.Defense && formik.errors.baseInfo?.Defense && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.baseInfo?.Defense}
                </p>
              )}
          </div>
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sp. Attack</label>
              <input  onChange={formik.handleChange} value={formik.values.baseInfo.hasOwnProperty('Sp. Attack') ? formik.values.baseInfo['Sp. Attack'] : ''}   type="text" name="baseInfo['Sp. Attack']"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Sp. Attack" required/>
              {formik.touched.baseInfo?.['Sp. Attack'] && formik.errors.baseInfo?.['Sp. Attack'] && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.baseInfo?.['Sp. Attack']}
                </p>
              )}
          </div>
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sp. Defense</label>
              <input  onChange={formik.handleChange} value={formik.values.baseInfo.hasOwnProperty('Sp. Defense') ? formik.values.baseInfo['Sp. Defense'] : ''}   type="text" name="baseInfo['Sp. Defense']"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Sp. defense" required/>
              {formik.touched.baseInfo?.['Sp. Defense'] && formik.errors.baseInfo?.['Sp. Defense'] && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.baseInfo?.['Sp. Defense']}
                </p>
              )}
          </div>
          <div>
              <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Speed</label>
              <input  onChange={formik.handleChange}  value={formik.values.baseInfo?.Speed}  type="text" name="baseInfo.Speed"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="speed" required/>
              {formik.touched.baseInfo?.Speed && formik.errors.baseInfo?.Speed && (
                  <p className=" text-rose-600 font-medium mt-2">
                    {formik.errors.baseInfo?.Speed}
                </p>
              )}
          </div>
                                                     
          </form>
        }

        onSubmit={formik.handleSubmit}
        onRemove={handleRemoveRecord}
        onCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default Home;
