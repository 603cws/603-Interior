import { useState } from "react";
import Clients from "./Clients";
import ClientBoq from "./ClientBoq";

function AdminDashClient({ isExpanded, allusers, setIsrefresh }) {
  const [clientBoqs, setClientBoqs] = useState(false);

  return (
    <>
      {!clientBoqs && (
        <Clients
          isExpanded={isExpanded}
          allusers={allusers}
          setIsrefresh={setIsrefresh}
          setClientBoqs={setClientBoqs}
        />
      )}

      {clientBoqs && <ClientBoq setClientBoqs={setClientBoqs} />}
    </>
  );
}

export default AdminDashClient;
