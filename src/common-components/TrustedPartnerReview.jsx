import { MdOutlineStarPurple500 } from "react-icons/md";

function TrustedPartnerReview({
  starcount,
  companyname,
  partnertype,
  companylogo,
  review,
}) {
  return (
    <div className="max-w-sm border-2 rounded-xl my-2 mx-2 border-[#000] border-opacity-25 shadow-lg p-2">
      <div className="flex gap-2">
        <div>
          <img
            src={`/images/Trustedpartner/${companylogo}.png`}
            alt="logo the company"
          />
        </div>
        <div>
          <h2 className="text-semibold text-xl text-[#000]">{companyname}</h2>
          <p>{partnertype}</p>
        </div>
      </div>
      <div>
        <p className="text-sm px-2 py-3">{review}</p>
      </div>
      <div className="flex items-center gap-2 px-2 pb-2">
        <div className="flex">
          {Array.from({ length: starcount }, (_, index) => (
            <MdOutlineStarPurple500 key={index} color="yellow" size={25} />
          ))}
        </div>
        <div>
          <p>{starcount.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}

export default TrustedPartnerReview;
