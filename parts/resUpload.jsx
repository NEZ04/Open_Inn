const ResUpload = ({onHandleUplod})=>{
    return(
             <form action="/upload" method="post" enctype="multipart/form-data" className="bg-[#010101] text-white flex flex-col justify-center items-center p-15 rounded-2xl border-dashed border-[#39CF8C] border-2">
                <h1>Drop your resume here or choose a file.</h1>
                <h1>PDFs only with a max size of 2MB</h1>
                <label for="fileUpload" className="bg-[#39CD8B] text-white mt-6 mb-1 px-4 rounded-4xl cursor-pointer py-1">Upload Your Resume</label>
                <input type="file" id="fileUpload" name="file" className="hidden" onChange={onHandleUplod}></input>
                <h1 id="heading2">No File choosen</h1>
                {/* <button type="submit">Upload</button> */}
            </form>
    )
}
export default ResUpload;