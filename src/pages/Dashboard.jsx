import { RiDashboardFill } from "react-icons/ri";

function Dashboard() {
  return (
    <div>
      <div className="flex">
        {/* sidebar */}
        <div className="h-screen max-w-sm bg-red-600">
          {/* logo */}
          <div className="cursor-pointer flex justify-center items-center">
            <img src="/logo/logo.png" alt="Logo" className="h-20 w-32" />
          </div>

          {/* main */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
          </div>
          {/* others */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>setting</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>setting</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-yellow-700">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">client</h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
            </div>
          </div>

          {/* div for content */}
          <div className="flex-1 bg-green-500">
            {/* for dashboard */}
            <div className="">
              {/* dashboard area layout */}
              <div>
                <h2 className="capitalize font-bold">Layout Information</h2>
                {/* div containing information */}
                <div className="flex gap-10">
                  {/* each icon  */}
                  <div className="flex justify-around items-center gap-3 bg-blue-600 py-3 px-2">
                    <div>
                      <img
                        src="/images/layouticon.png"
                        alt=" dashboard layout "
                        className="w-[60px] h-[60px]"
                      />
                    </div>
                    <div className="capitalize pr-10">
                      <p className="font-bold text-lg">
                        1500 <span>sqft</span>
                      </p>
                      <p className="text-base">total area</p>
                    </div>
                  </div>
                  {/* each icon  */}
                  <div className="flex justify-around items-center gap-3 bg-blue-600 py-3 px-2">
                    <div>
                      <img
                        src="/images/layouticon.png"
                        alt=" dashboard layout "
                        className="w-[60px] h-[60px]"
                      />
                    </div>
                    <div className="capitalize pr-10">
                      <p className="font-bold text-lg">
                        1500 <span>sqft</span>
                      </p>
                      <p className="text-base">total area</p>
                    </div>
                  </div>
                  {/* each icon  */}
                  <div className="flex justify-around items-center gap-3 bg-blue-600 py-3 px-2">
                    <div>
                      <img
                        src="/images/layouticon.png"
                        alt=" dashboard layout "
                        className="w-[60px] h-[60px]"
                      />
                    </div>
                    <div className="capitalize pr-10">
                      <p className="font-bold text-lg">
                        1500 <span>sqft</span>
                      </p>
                      <p className="text-base">total area</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
