import { supabase } from "../../../services/supabase";
import { useState, useEffect } from "react";
import PagInationNav from "../../../common-components/PagInationNav";

function SubscripedEmail() {
  const [SubscripedEmail, setSubscripedEmail] = useState([]);

  useEffect(() => {
    fetchSubscripedEmails();
  }, []);

  const fetchSubscripedEmails = async () => {
    try {
      const { data, error } = await supabase.from("news_letter").select("*");
      if (error) console.error("Error fetching SubscripedEmail:", error);
      setSubscripedEmail(data);
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };

  return (
    <div>
      {/* <div className="border-b border-b-[#ccc]">
        <div className="flex justify-between items-center">
          <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg ">
            Discount
          </h2>
        </div>
      </div> */}
      <div>
        <CouponTable SubscripedEmail={SubscripedEmail} />
      </div>
    </div>
  );
}

export default SubscripedEmail;

const CouponTable = ({ SubscripedEmail }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const discountCouponPerPage = 9;

  const indexoflastDisocunt = currentPage * discountCouponPerPage;
  const indexofFirstDiscount = indexoflastDisocunt - discountCouponPerPage;
  const currentBlogs = SubscripedEmail.slice(
    indexofFirstDiscount,
    indexoflastDisocunt
  );

  const totalPages = Math.ceil(SubscripedEmail.length / discountCouponPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <table className="w-full text-left">
        <thead className="text-[#232321]/80 font-semibold ">
          <tr className="border-b">
            {/* <th className="py-2">Id</th> */}
            <th className="py-2">Email</th>
            <th className="py-2">subscriped Status</th>
            <th className="py-2">createdAt</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((SubscripedEmail) => (
            <tr
              key={SubscripedEmail.id}
              className="border-b text-xs md:text-sm text-[#000] font-semibold hover:bg-[#f1f1f1] "
            >
              {/* <td className="py-3.5">{SubscripedEmail?.id}</td> */}
              <td className="py-3.5">{SubscripedEmail?.email}</td>
              <td className="py-3.5">
                {SubscripedEmail?.subscribed ? "Enabled" : "Disabled"}
              </td>
              <td className="py-3.5">{SubscripedEmail?.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PagInationNav
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
