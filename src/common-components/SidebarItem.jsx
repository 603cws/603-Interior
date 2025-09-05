function SidebarItem({ icon, text, onClick, isExpanded, currentSection }) {
  return (
    <div
      className={`flex items-center  gap-3 hover:bg-[#E9E9E9] p-2 rounded cursor-pointer ${
        isExpanded ? "" : "justify-center"
      } ${
        currentSection?.toLowerCase() === text?.toLowerCase()
          ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] px-4 py-2 rounded-md text-white"
          : "text-[#1A3365]"
      }`}
      onClick={onClick}
    >
      <div className="text-2xl ">{icon}</div>
      <span className={`${isExpanded ? "block" : "hidden"} text-base`}>
        {text}
      </span>
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
