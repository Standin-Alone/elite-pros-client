import Header from '@/components/header'
import type { AppProps } from 'next/app'
import "../../public/globals.css";
import Base from '@/components/base';
import { Context } from '@/components/context';
import { useState } from 'react';
import Script from "next/script";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [ context, setContext ] = useState(pageProps);
    
    return(
    <>
        <Context.Provider value={[context,setContext]}>
            <Header/>
            <Base>
                <Component {...pageProps} />     
            </Base>        
        </Context.Provider>
        <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"></script>
    </>
    )
}