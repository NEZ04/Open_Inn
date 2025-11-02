import "./resume.css";
import ResAnalyze from "../../components/resAnalyze";
import ResumeCheck from "../../components/resumeCheck";
import ResBuilder from "../../components/resBuilder";
import ResNav from "../../components/resNav";
import ResUpload from "../../components/resUpload";
const Resume = () => {
     const handleUpload = (e) => {
        console.log(e);
        const heading = document.getElementById("heading");
        heading.textContent = e.target.files.length
            ? e.target.files[0].name
            : "No file chosen";
    }
    return (
        <div className="bg-linear-to-r from-[#000000] from-40% to-[#403485] min-h-screen min-w-screen flex flex-col items-center justify-start p-15 pb-0">
           <ResNav/>
           <ResumeCheck onHandleUpload={handleUpload}/>
            <ResAnalyze/>
            <ResBuilder/>
            <ResUpload onHandleUplod={handleUpload}/>
        </div>
    )
}
export default Resume;