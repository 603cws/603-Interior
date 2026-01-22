import VendorEditAddon from "../vendor/VendorEditAddon";
import VendorProductEdit from "../vendor/VendorProductEdit";
import { useState } from "react";
import ItemTable from "./ItemTable";

function AdminDashItems() {
  const [editProduct, setEditProduct] = useState(false);
  const [editAddon, setEditAddon] = useState(false);
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);
  const [isproductRefresh, setIsProductRefresh] = useState(false);
  const [productlist, setProductlist] = useState(true);
  const [selectedproduct, setSelectedproduct] = useState(null);
  const [selectedAddon, setSelectedAddon] = useState(null);

  return (
    <>
      <div className="scrollbar-hide h-full overflow-y-auto">
        {editProduct ? (
          <VendorProductEdit
            setEditProduct={setEditProduct}
            setProductlist={setProductlist}
            setIsProductRefresh={setIsProductRefresh}
            selectedproduct={selectedproduct}
          />
        ) : editAddon ? (
          <VendorEditAddon
            seteditAddon={setEditAddon}
            selectedAddon={selectedAddon}
            setProductlist={setProductlist}
            setIsAddonRefresh={setIsAddonRefresh}
          />
        ) : (
          <ItemTable
            isaddonRefresh={isaddonRefresh}
            setIsAddonRefresh={setIsAddonRefresh}
            isproductRefresh={isproductRefresh}
            setIsProductRefresh={setIsProductRefresh}
            productlist={productlist}
            setProductlist={setProductlist}
            setSelectedproduct={setSelectedproduct}
            setSelectedAddon={setSelectedAddon}
            setEditProduct={setEditProduct}
            setEditAddon={setEditAddon}
          />
        )}
      </div>
    </>
  );
}

export default AdminDashItems;
