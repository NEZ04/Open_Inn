import GlareHover from "./GlareHover"

const LanPricing = () => {
  return (
     <div className=" bg-[#090909] min-h-screen min-w-screen flex flex-col items-center justify-start p-15 gap-5">
        <div className="bg-[#37BC7E] rounded-4xl p-0.5">
          <button className="bg-[#031D14] rounded-4xl px-7 font-bold py-1 text-[#F5E9CB]">Pricing</button>
        </div>
        <h1 className="relative text-[#FFFFFF] tracking-wider  text-5xl">Plans for Everyone</h1>
        <section className="grid grid-cols-3 grid-rows-6 gap-5 p-2 pr-4">
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
            className="row-span-5 hover:cursor-default h-auto border-2 w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%]  "
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
            className="row-span-5 hover:cursor-default h-auto border-2 w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%]  "
          />
          <GlareHover
            glareColor="#36b274"
            glareOpacity={0.6}
            glareAngle={-45}
            glareSize={400}
            transitionDuration={1000}
            playOnce={false}
            width='350px'
            height='500px'
            background=""
            className="row-span-5 hover:cursor-default h-auto border-2 w-aut bg-linear-[135deg,#000000_5%,#36B27450_15%,#000000_30%,#36B27450_45%,#000000_60%,#2F936060_75%,#000000_90%]  "
          />
        </section>
      </div>
  )
}

export default LanPricing;