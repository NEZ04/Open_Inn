import GlareHover from "./GlareHover"

const LanMain = () => {
  return (
    <>
    <div className="font-[Montserrat] flex flex-col items-center justify-center font-normal text-white absolute top-50 left-80">
          <h1 className="text-center text-4xl">Turn your big idea into real-world Innovation<br></br> with Right People</h1>
          <h1>Register your projects to build a perfect team or join existing to become a perfect team</h1>
          <div className="flex flex-row">
            <button className="bg-linear-to-b from-[#51D685] to-[#B5F415] h-fit p-3 relative top-2 m-2 rounded-4xl text-black font-bold text-lg">Register Your Project</button>
            <div className="bg-linear-to-b from-[#51D685] to-[#B5F415] relative top-2 p-0.5 h-fit m-2  rounded-4xl ">
              <button className="text-amber-50 rounded-4xl bg-[#090909] px-7 py-3  font-bold  ">Join a Project </button>
            </div>
          </div>
        </div>
        <div className="relative h-1/2 flex gap-7 items-center justify-center pb-10 ">
          <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width='350px'
            height='230px'
            background=""
            className="rotate-12 hover:cursor-default shadow-2xl/100 shadow-[#3DCA86] bg-linear-[135deg,#082B1F,#021D11_10%,#083325_25%,#0D492C_30%,#245A42_35%,#071C15_55%,#1B4C35_70%,#021D11_100%] "
          />
          <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            background=""
            width="436px"
            height="320px"
            className="shadow-2xl/100 hover:cursor-default shadow-[#3DCA86] bg-linear-[135deg,#000000,#021D11_10%,#0D492C_20%,#000000_40%,#071C15_50%,#0D492C_70%,#000000_90%,#021D11_100%]"
          />
          <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            background=""
            className="rotate-168 hover:cursor-default shadow-2xl/100 shadow-[#3DCA86] bg-linear-[120deg,#082B1F,#021D11_10%,#083325_25%,#0D492C_30%,#245A42_35%,#071C15_55%,#1B4C35_70%,#021D11_100%]"
            height="230px"
            width="350px"

          />

          {/* </GlareHover> */}
        </div>
        </>
  )
}

export default LanMain