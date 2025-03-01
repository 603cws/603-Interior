function SidebarItem({ icon, text, onClick, isExpanded }) {
  return (
    <div
      className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] p-2 rounded cursor-pointer ${
        isExpanded ? "" : "justify-center"
      }`}
      onClick={onClick}
    >
      <div className="text-2xl">{icon}</div>
      <span className={`${isExpanded ? "block" : "hidden"}`}>{text}</span>
    </div>
  );
}

export default SidebarItem;

// const SidebarItem = ({ icon, text, onClick, isExpanded }) => (
//   <div
//     className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] p-2 rounded cursor-pointer ${
//       isExpanded ? "" : "justify-center"
//     }`}
//     onClick={onClick}
//   >
//     <div className="text-2xl">{icon}</div>
//     <span className={`${isExpanded ? "block" : "hidden"}`}>{text}</span>
//   </div>
// );
