import {useEffect,useState,useContext} from 'react';
import { useRouter } from "next/router";
import { Context } from '../context';

export default function Header(){    
    const [context,setContext] = useContext<any>(Context);
    const router = useRouter();    
 
    const [userInfo,setUserInfo] = useState<any>();

    useEffect(()=>{
        const localToken = localStorage.getItem("userInfo");    
        setUserInfo(localToken);
    },[context])
    const logout = ()=>{
        localStorage.clear();
        setContext(null);
        router.push('/');        
    }

    return(
    
    <header>
        <nav className="bg-red border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 z-40">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <a href="/" className="flex items-center">
                    <img src="/elite-pros.jpeg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Elite Pros</span>
                </a>
                {(userInfo  || context?.userInfo) ? 
                    <div className="flex items-center lg:order-2">
                        <a href="/" className="text-red-800 dark:text-white hover:bg-red-50 focus:ring-4 focus:ring-red-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-red-500 focus:outline-none dark:focus:ring-red-200" onClick={logout}>Log Out</a>                    
                    </div>         
                    : ''
                }       
                           
            </div>
        </nav>
    </header>)
}