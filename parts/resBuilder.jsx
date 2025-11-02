const ResBuilder = ()=>{
return(
    <section className="bg-linear-to-b from-[#F7F7F7] to-[#39B071] h-screen w-screen min-h-screen min-w-screen flex items-center justify-center">
                <div className="bg-[#A9A0E2] h-120 w-250 rounded-2xl flex">
                <div className="flex flex-col gap-5 p-10">
                    <button className="border-2 border-white w-fit px-9 bg-[#6A6491] text-white rounded-4xl py-0.5">AI Resume Builder</button>
                    <h1 className="text-black font-semibold text-4xl">Make your professional with AI in minutes</h1>
                    <p>From generating bullet points to automatic formatting use our advanced trained ai model to build an ats friendly resume.</p>
                    <p className="text-white">modify your resume according to the job description.</p>
                    <div>
                        <button className="px-2 py-2 font-semibold border-2 border-[#8AD2B1] rounded-lg m-4 text-white bg-[#608675]">Build My Resume</button>
                        <button className="px-2 py-2 font-semibold text-[#000000] rounded-lg border-2 border-[#8D84C5] bg-[#EEF4F1]">Modify My Resume</button>
                    </div>
                </div>
                <div className="bg-white border-4 border-black w-1/2 my-6 mx-6"></div>
                </div>
            </section>
)
}
export default ResBuilder;