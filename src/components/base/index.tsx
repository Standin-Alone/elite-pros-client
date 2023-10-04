const  Base = ({children}:any) => {    
    return(
        <div className="min-h-screen w-screen bg-gradient-to-b from-orange-100 to-orange-400 flex justify-center">
            {children}
        </div>
    )
}

export default Base;

