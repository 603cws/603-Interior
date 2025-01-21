import React from "react";
import "./NumberAnimation.css";

const NumberAnimation = () => {
  return (
    <div>
      <div class="circle">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="big">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="tri"></div>
      <div class="squ">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="end">
        <div>6</div>
        <div>0</div>
        <div>3</div>
      </div>
    </div>
    // <div className="relative w-screen h-screen overflow-hidden">
    //   {/* Circle Animation */}
    //   <div className="absolute top-0 left-0 w-full h-full bg-[#3a6e9a]">
    //     <div className="circle">
    //       <div className="animate-[anim_01_2s_forwards]"></div>
    //       <div className="animate-[move_01_2s_2s]"></div>
    //       <div className="animate-[move_02_2s_2s]"></div>
    //       <div className="animate-[move_03_2s_2s]"></div>
    //       <div className="animate-[move_04_2s_2s]"></div>
    //     </div>
    //   </div>

    //   {/* Big Balls Animation */}
    //   <div className="absolute top-0 left-0 w-full h-full">
    //     <div className="absolute top-[calc(50%-1500px)] left-[calc(50%-1500px)] w-[3000px] h-[3000px] bg-[#fffcee] rounded-full scale-0 animate-[big_0.5s_4s_forwards]"></div>
    //     <div className="absolute top-[calc(50%-1500px)] left-[calc(50%-1500px)] w-[3000px] h-[3000px] bg-[#bd8e99] rounded-full scale-0 animate-[big_0.5s_4.5s_forwards]"></div>
    //     <div className="absolute top-[calc(50%-1500px)] left-[calc(50%-1500px)] w-[3000px] h-[3000px] bg-[#9e3f57] rounded-full scale-0 animate-[big_0.5s_5s_forwards]"></div>
    //   </div>

    //   {/* Triangular Animation */}
    //   <div className="absolute bottom-[-300vw] left-[-100vw] w-0 h-0 border-l-[150vw] border-r-[150vw] border-b-[300vw] border-b-[#fffbbd] animate-[tri_0.6s_5.3s_linear_forwards]"></div>

    //   {/* Square Animation */}
    //   <div className="absolute top-0 left-0 w-full h-full">
    //     <div className="absolute top-[calc(50%-50px)] left-[calc(50%-50px)] w-[100px] h-[100px] bg-[#3a6e9a] rounded-full scale-0 animate-[squ_0.6s_5.8s_cubic-bezier(0,_0.73,_0.54,_2.4)_forwards]"></div>
    //     <div className="absolute top-[calc(50%-50px)] left-[calc(50%-50px)] w-[100px] h-[100px] bg-[#3a6e9a] rounded-full scale-0 animate-[moveSqu_01_0.8s_6.5s_forwards]"></div>
    //     <div className="absolute top-[calc(50%-50px)] left-[calc(50%-50px)] w-[100px] h-[100px] bg-[#3a6e9a] rounded-full scale-0 animate-[moveSqu_02_0.8s_6.5s_forwards]"></div>
    //     <div className="absolute top-[calc(50%-50px)] left-[calc(50%-50px)] w-[100px] h-[100px] bg-[#3a6e9a] rounded-full scale-0 animate-[moveSqu_03_0.8s_6.5s_forwards]"></div>
    //   </div>

    //   {/* End Numbers */}
    //   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full opacity-0 animate-[end_1s_7.4s_forwards]">
    //     <div className="flex space-x-6 opacity-0 animate-[end_1s_7.4s_forwards]">
    //       <div className="text-[70px] text-white bg-[#3a6e9a]">{6}</div>
    //       <div className="text-[70px] text-white bg-[#3a6e9a]">{0}</div>
    //       <div className="text-[70px] text-white bg-[#3a6e9a]">{3}</div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default NumberAnimation;
