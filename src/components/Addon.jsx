function Addon() {
  return (
    <div>
      <div className="relative w-[240px]">
        <img className="w-full" src="images/chair/1.png" alt="Addon" />
        <button className="absolute bottom-4 text-white font-bold  right-11 uppercase border px-3 py-2 hover:bg-white hover:text-black">
          ADD TO Cart
        </button>
      </div>
    </div>
  );
}

export default Addon;
