const Register = ()=>{
    return(
         <div className="bg-black min-h-screen min-w-screen">
            <div className="w-[95vw] h-[80vh] blur-[60px] bg-[#101E39] rounded-t-full absolute bottom-0 left-[2%] "></div>
            <div className=" absolute w-50 h-50 bg-[#37D191] rounded-full left-[27%] z-0"></div>
            <div className=" absolute w-40 h-40 bg-[#37D191] rounded-full left-[65%] top-[15%] z-0"></div>

            {/* <div className="relative bg-linear-to-br from-[#FBE8E8] from-0% to-[#224790] p-[3px] w-fit left-105 top-20 rounded-3xl"> */}

            <div className="bg-[#11111161] backdrop-blur-2xl p-2  relative  left-105 top-15  rounded-3xl size-120 flex flex-col items-center justify-center text-white shadow-2xl/30">
                <h1 className="my-8 text-5xl" >Register</h1>
                <h2 className="text-center">Register Your Account to dive into thriving ecosystem of OpenInnovation.</h2> 
                <form className="w-full">
                    <div className="p-px mx-2 my-5 bg-linear-to-br from-[#336DAE] to-[#61217E] relative rounded-3xl">
                    <div className="rounded-3xl p-3 flex bg-[#090909]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                        </svg>
                        <input className="mx-1 outline-none border-none ring-0 text-white" type="email" placeholder=" Enter Your Email"></input><br></br>
                    </div>
                    
                    </div>
                     <div className="p-px mx-2  my-5 bg-linear-to-br from-[#336DAE] to-[#61217E] relative rounded-3xl">
                    <div className="rounded-3xl p-3 bg-[#090909] flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                        </svg>
                        <input className="mx-1 outline-none border-none text-white ring-0" type="password" placeholder="Enter Your Password"></input>
                    </div>
                    </div>
                    <div className="bg-linear-to-br from-[#336DAE] to-[#9A9797] p-px mx-2 my-10 rounded-3xl ">
                    <button className=" w-full p-2 bg-[#1F1F1F]   text-white rounded-3xl">Log In</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Register;