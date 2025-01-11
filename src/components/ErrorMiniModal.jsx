import React from 'react';
import { IoWarningSharp } from 'react-icons/io5';

function ErrorMiniModal({ text }) {
    return (
        <div className="rounded-lg w-[300px] h-[41px] left-[200px] -bottom-9 absolute overflow-hidden">
            <div className="absolute left-[27px] top-1.5 overflow-visible transform -translate-x-1/2 w-2.5 h-2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-[#F00000]"></div>
            <div className="rounded-md w-full h-[30px] absolute left-0 top-[11px] overflow-visible bg-[#F00000]"></div>
            <div className="pt-px pr-1.5 pb-px pl-1.5  h-3.5 absolute left-[7px] top-[19px]">
                {/* <div className="h-auto absolute left-1.5 top-px overflow-visible bg-blue-500 w-[0px]"></div> */}
                <IoWarningSharp color='white' />
                <div className="text-[#fff] text-left font-['Poppins-Regular',_sans-serif] text-xs leading-6 font-normal absolute left-[26px] top-[5px] w-full h-2 flex items-center justify-start text-nowrap">
                    {text}
                </div>
            </div>
        </div>
    )
}

export default ErrorMiniModal