const Tooltip = ({ text, children }) => {
  return (
    <div className="group">
      {children}
      <div className="">{text}</div>
    </div>
  );
};

export default Tooltip;
