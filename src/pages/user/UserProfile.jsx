import { useApp } from "../../Context/Context";

function UserProfile({ setIsEditopen }) {
  const { accountHolder } = useApp();
  return (
    <div className="sm:w-[400px] lg:w-[500px] shadow-2xl   rounded-3xl">
      <div className="flex justify-end items-center px-10 lg:px-16  lg:pb-3 pt-2 w-full ">
        <button
          className="capitalize font-medium text-base px-5 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA] "
          onClick={() => setIsEditopen(false)}
        >
          edit
        </button>
      </div>
      <div className="px-10 lg:mp-16  pb-4 lg:pb-8 pt-2 p-5 w-full ">
        <div className="flex justify-center  items-center">
          <img
            src={accountHolder.profileImage}
            alt="profile"
            className="w-28 h-28"
          />
        </div>
        <h2 className="text-center text-[#194F48] font-bold text-xl">
          {accountHolder.companyName}
        </h2>
        <div className="flex items-center justify-start gap-4 w-full my-2">
          <h3 className="text-[#CACED8]  capitalize w-1/2 ">email</h3>
          <p className="text-[#194F48] w-1/2">{accountHolder.email}</p>
        </div>
        <div className="flex   items-center gap-4 text-nowrap my-2">
          <h3 className="text-[#CACED8] text-lg capitalize flex-1">
            Phone Number
          </h3>
          <p className="text-[#194F48] flex-1">{accountHolder.phone}</p>
        </div>
        <div className="flex justify-center  gap-4 text-nowrap my-2">
          <h3 className="text-[#CACED8] text-lg capitalize flex-1">
            Company Name
          </h3>
          <p className="text-[#194F48] flex-1">{accountHolder.companyName}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
