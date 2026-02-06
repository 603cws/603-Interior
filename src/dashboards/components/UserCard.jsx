import { useApp } from "../../Context/Context";

function UserCard({ setIsEditopen }) {
  const { accountHolder } = useApp();
  return (
    <div className="w-[320px] sm:w-[400px] lg:w-[500px] border border-[#ccc] shadow-xl rounded-lg">
      <div className="text-sm px-5 py-10  md:p-10 w-full ">
        <div className="flex py-3 items-center gap-3 border-b border-b-[#ccc]">
          <div
            className="rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              src={accountHolder?.profileImage}
              alt="profile"
              className="h-8 w-8 md:w-12 md:h-12 xl:w-16 xl:h-16 p-1"
            />
          </div>
          <div className="">
            <h2 className=" text-gray-800  text-lg">
              {accountHolder?.companyName}
            </h2>
            <p className="text-gray-500 text-sm  lg:text-base">
              {accountHolder?.email}
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <UserDetailDisplay
            title={"Company Name"}
            value={accountHolder?.companyName}
            className={"border-b border-b-[#ccc]"}
          />
          <UserDetailDisplay
            title={"Phone Number"}
            value={accountHolder?.phone}
            className={"border-b border-b-[#ccc]"}
          />
          <UserDetailDisplay
            title={"Location"}
            value={accountHolder?.location}
            className={""}
          />
        </div>

        <div className="flex justify-start items-center   pt-2 w-full">
          <button
            className="capitalize font-medium text-base px-5 py-2 rounded-lg text-white border-[#374A75] border bg-[#374A75] hover:bg-[#6d87c4]"
            onClick={() => setIsEditopen(false)}
          >
            edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;

function UserDetailDisplay({ title, value, className }) {
  return (
    <div
      className={`flex flex-col md:flex-row justify-between gap-4 text-nowrap my-2 py-3  ${className}`}
    >
      <h3 className="text-gray-800  capitalize ">{title}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}
