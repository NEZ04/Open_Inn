const ResumeCheck = ({onHandleUpload}) => {
    return (
        <section className="py-10 flex">
            <div className="pr-20 flex flex-col items-start ">
                <h1 className="text-[#9487E1]">Resume Checker</h1>
                <h1 className="text-white font-bold my-4 text-4xl">Is your resume good<br /> enough?</h1>
                <h1 className="text-white text-xs">Upload your resume to find ats score and crucial checks before <br /> you apply for any jobs</h1>
            </div>
            <form action="/upload" method="post" enctype="multipart/form-data" className="bg-[#010101] text-white flex flex-col justify-center items-center p-15 rounded-2xl border-dashed border-[#39CF8C] border-2">
                <h1>Drop your resume here or choose a file.</h1>
                <h1>PDFs only with a max size of 2MB</h1>
                <label for="fileUpload" className="bg-[#39CD8B] text-white mt-6 mb-1 px-4 rounded-4xl cursor-pointer py-1">Upload Your Resume</label>
                <input type="file" id="fileUpload" name="file" className="hidden" onChange={onHandleUpload}></input>
                <h1 id="heading">No File choosen</h1>
                {/* <button type="submit">Upload</button> */}
            </form>
        </section>
    )
}
export default ResumeCheck;