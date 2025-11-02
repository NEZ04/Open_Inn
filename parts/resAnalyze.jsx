const ResAnalyze = ()=>{
    return(
        <section className="bg-[#3AC180] h-screen w-screen max-h-1/2 max-w-49/50 rounded-3xl flex flex-col items-center justify-center m-20">
            <div className="bg-[#343434] h-2/3 w-10/11 relative top-10 rounded-2xl overflow-visible  flex">
            <div className="bg-white  h-[400px] w-1/2 rounded-3xl -mt-15 ml-10 mr-10">
            <img src="" alt="" className=""/>
            <h1>Hello</h1>
            <p>Myself James, your AI career analyst. With over 100,000 resumes meticulously processed, I'm here to offer insights and guidance based on resume and help to increase your chances to get noticed.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-5 gap-5">
            <h1 className="w-full text-2xl font-semibold text-white ">AI resume analyzer</h1>
            <h1 className="w-full text-4xl font-semibold text-white">Chat with the advanced ai model to find fixes.</h1>
            <h1 className="w-full font-semibold text-white">Upload your resume and discuss with the ai how you can enhance your resume and boost your ats score and increase your chances to get noticed. </h1>
            <div>
            <button className="text-white bg-[#39CD8B] px-2 py-1 rounded-lg m-2 mx-4">Upload Your Resume</button>
            <button className="text-white bg-[#8680B0] px-2 py-1 rounded-lg m-2 mx-4">Chat with James</button>
            </div>
            </div>
            </div>
            </section>
    )
}
export default ResAnalyze;