const CollabWorks = ()=>{
    return(
        <div className="h-screen w-screen min-h-screen min-w-screen relative overflow-hidden bg-black">
            <div className="bg-[#37D191] rounded-full h-60 w-60 blur-[180px] left-35 absolute"></div>
            <div className="bg-[#3E3381] rounded-full h-120 w-120  blur-[50px] absolute -top-50 -right-30 "></div>
            <section className="flex gap-5 h-screen w-screen min-h-screen justify-between min-w-screen ">
                <section className="bg-white/10 backdrop-blur-2xl border-2  h-screen border-amber-400">
                    <div> h</div>
                    <div></div>
                    <div></div>

                </section>
                <section className=" border-2  border-amber-400"></section>
                <section className=" border-2  border-amber-400"></section>
            </section>
        </div>
    )
}
export default CollabWorks;