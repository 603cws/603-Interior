import { MdCancel } from "react-icons/md";

function RegisterUser() {
    return (
        <div   style={{ backgroundImage: "url('/images/RegisteruserBackground.jpeg')" }} className=" h-screen flex justify-center items-center" >
        <div className="w-[75%] h-[75%] pt-10 mx-auto grid grid-cols-2 border-2 border-[#1A3A36] rounded-3xl bg-gradient-to-br from-[#CCCCCC] via-[#7C8A88] to-[#1A3A36]">
        {/* <div className="  grid grid-cols-2 border-2 border-yellow-500 rounded-3xl "> */}
            {/* form */}
            <div className="my-10 ">
                <p className="text-center font-bold">Register User</p>
                <div className="mx-5">
                    <form action="" className="">
                        {/* email */}
                        <div className="mb-3" >
                            {/* label */}
                            <label  className="block text-sm font-medium mb-2 ">
                                   Email
                            </label>
                            <input type='email'placeholder="Enter your email " className="w-full text-sm h-7 border-1 rounded-md pl-2" />
                        </div>
                        {/* company name */}
                        <div className="mb-3">
                            {/* label */}
                            <label  className="block text-sm font-medium mb-2 ">
                                   Company Name
                            </label>
                            <input type='text'placeholder="Enter company name" className="w-full text-sm h-7 border-1 rounded-md pl-2" />
                        </div>
                        {/* Mobile Number*/}
                        <div className="mb-3">
                            {/* label */}
                            <label  className="block text-sm font-medium mb-2 ">
                                   Mobile Number
                            </label>
                            <input type='number'  className="w-full text-sm h-7 border-1 rounded-md pl-2"/>
                        </div>
                        {/* location*/}
                        <div className="mb-3">
                            {/* label */}
                            <label  className="block text-sm font-medium mb-2 ">
                                   Location 
                            </label>
                            <input type='text' placeholder="Enter your location" className="w-full h-7 text-sm border-1 rounded-md pl-2" />
                        </div>

                        <div className="bg-green-950 mt-8">
                            <button className="w-full text-white">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* image */}
            <div className="overflow-hidden">
                <img src="images/Register.png" alt="sitting area image" />
            </div>
        </div>
        </div>
    )
}

export default RegisterUser
