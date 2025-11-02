import { Route, Routes } from "react-router-dom";
import CollabWorks from "./pages/collabWorkspace/collabWorks";
import LandingPage from "./pages/landingPage/landingPage";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Resume from "./pages/resume/resume";

const App = ()=>{
  return(
<>
<Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    {/* <LandingPage/> */}
    {/* <Resume />
    <CollabWorks/> */}
    </>
  )
}
export default App;