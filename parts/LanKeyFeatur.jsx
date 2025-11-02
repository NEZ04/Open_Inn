
import GlareHover from './GlareHover'

const LanKeyFeatur = () => {
  return (
    <div className=" bg-[#090909] min-h-screen min-w-screen flex flex-col items-center justify-start p-15 gap-5">
        <div className="bg-[#37BC7E] rounded-4xl p-0.5">
          <button className="bg-[#031D14] rounded-4xl px-7 font-bold py-1 text-[#F5E9CB]">Key Features</button>
        </div>
        <h1 className="relative text-[#FFFFFF] tracking-wider  text-5xl">Why Choose <span className="italic">OpenInnovate</span>?</h1>
        <section className="grid grid-cols-4 grid-rows-3 gap-5 pt-5">
          <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width=''
            height=''
            background=""
            className="  h-auto border-2 hover:cursor-default w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%]"
            />
           <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width=''
            height=''
            background=""
            className="  h-auto border-2 hover:cursor-default w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%] "
          /> <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width=''
            height=''
            background=""
            className="  h-auto border-2 hover:cursor-default w-auto col-span-2 row-span-2 col-start- bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%] "
          /> <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width=''
            height=''
            background=""
            className="  col-span-2 hover:cursor-default col-start-1 h-auto border-2 w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%] "
          /> <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width=''
            height=''
            background=""
            className="  col-span-2 hover:cursor-default col-start-1 h-auto border-2 w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%] "
          /> <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width='500px'
            height='230px'
            background=""
            className="border-2 hover:cursor-default col-span-2 bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%] "
          />
        </section>
      </div>
  )
}

export default LanKeyFeatur