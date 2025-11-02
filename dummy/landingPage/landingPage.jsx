import "./landingPage.css";
import GlareHover from '../../components/GlareHover';
import { Link,useNavigate } from "react-router-dom";
import LanPricing from "../../components/LanPricing";
import LanWorks from "../../components/LanWorks";
import LanKeyFeatur from "../../components/LanKeyFeatur";
import LanMain from "../../components/LanMain";
const LandingPage = () => {
      const navigate = useNavigate();
  return (

    <>
      <div className=" bg-linear-to-b from-[#090909] from-50% to-[#3ED194] min-h-screen min-w-screen ">
        <div className="h-screen min-w-screen max-h-[80vh] bg-[#090909] rounded-b-full blur-[90px] "></div>
        <div className="bg-linear-to-br from-[#000000] to-[#3CC88E] p-[2.5px] rounded-[48px] w-screen max-w-270 left-30 absolute top-10 ">
          <nav>
          <div className="bg-[#000000]/90 flex flex-row justify-between rounded-[48px] p-3">
            <h1 className="text-amber-50 relative left-20"><span className="text-green-500 font-bold relative left-2 font-[Young Serif] text-2xl">Open</span> <br></br><span className="font-bold font-[Young Serif] text-xl">Innovate</span></h1>
             <div className="bg-linear-to-b from-[#51D685] to-[#B5F415] rounded-4xl ml-175 flex items-center justify-center p-0.5 relative top-2 h-fit">
             <button  onClick={() => navigate("/login")} className="text-amber-50 rounded-4xl bg-[#090909] px-5 py-2 ">Login</button>
            </div>
            <button onClick={() => navigate("/register")} className="text-black font-bold rounded-4xl h-fit p-2.5 relative right-8 top-2 bg-linear-to-b from-[#41D195] to-[#C9FF05]">Register</button>
          </div>
          </nav>
        </div>
        <LanMain/>
      </div>
      <LanKeyFeatur/>
      <LanWorks/>
     <LanPricing/>
     
    </>
  )
}
export default LandingPage;



