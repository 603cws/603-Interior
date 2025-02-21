import { useForm } from "react-hook-form";
import { useApp } from "../../Context/Context";
function VendorSetting() {
  const { accountHolder } = useApp();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };
  return (
    <div className="flex gap-5 w-full h-full px-8 py-4">
      {/*  */}
      <div className="flex flex-col items-center px-10 pt-4 gap-2">
        <img src="/images/Profile.png" alt="profile" className="w-28 h-28" />
        <h2 className="text-center text-[#194F48] font-bold text-xl capitalize">
          {accountHolder.companyName}
        </h2>
      </div>

      <div className="flex-1 font-Poppins">
        <h2 className="capitalize font-bold text-[#CACED8] text-lg">
          edit profile
        </h2>

        <p className="text-base text-[#CACED8] font-bold my-4 capitalize">
          Personal
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                First Name
              </h2>
              <input
                type="text"
                placeholder="name"
                {...register("firstName", { required: true })}
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                last Name
              </h2>
              <input
                type="text"
                {...register("lastName", { required: true })}
                className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
          </div>
          <div className="my-2">
            <h2 className="mb-2 text-[#194F48] font-bold capitalize">
              Company name
            </h2>
            <input
              type="text"
              placeholder="company name"
              {...register("companyName", { required: true })}
              className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
            />
          </div>

          <p className="text-base text-[#CACED8] font-bold my-3 capitalize">
            contact
          </p>
          <div className="flex w-full gap-4 mb-3">
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                email
              </h2>
              <input
                type="email"
                placeholder="email"
                {...register("email", { required: true })}
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                phone no
              </h2>
              <input
                type="number"
                {...register("mobileNo", { required: true })}
                className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
          </div>
          <div className="flex w-full gap-4 mb-2">
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                country
              </h2>
              <input
                type="text"
                placeholder="country name"
                {...register("country")}
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">city</h2>
              <input
                type="text"
                {...register("city", { required: true })}
                className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#26B893] rounded-lg px-6 py-2 text-[#fff] lg:mt-2 xl:mt-4 capitalize"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default VendorSetting;
