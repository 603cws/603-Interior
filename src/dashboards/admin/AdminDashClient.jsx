import { useState } from "react";
import Clients from "./Clients";
import ClientBoq from "./ClientBoq";

function AdminDashClient({ isExpanded, allusers, setIsrefresh }) {
  const [clientBoqs, setClientBoqs] = useState(false);
  const [filteredusers, setFilteredUsers] = useState(allusers);
  const [query, setQuery] = useState();
  const filterByMultipleFields = (query) => {
    if (!query) {
      setFilteredUsers(allusers); // Reset to original list when input is empty
      return;
    }
    const filtereduser = allusers.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtereduser);
  };
  return (
    <>
      {!clientBoqs && (
        <Clients
          isExpanded={isExpanded}
          filterByMultipleFields={filterByMultipleFields}
          query={query}
          filteredusers={filteredusers}
          setIsrefresh={setIsrefresh}
          setClientBoqs={setClientBoqs}
        />
      )}

      {clientBoqs && <ClientBoq setClientBoqs={setClientBoqs} />}
    </>
  );
}

export default AdminDashClient;
