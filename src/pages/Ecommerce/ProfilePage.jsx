const ProfilePage = () => {
  return (
    <div className="flex container mx-auto items-center px-36 py-20 gap-20">
      {/* Sidebar */}
      <aside className="w-96 bg-white shadow-sm gap-4 flex flex-col">
        {/* User Info */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 shadow-custom pb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.798.753 6.879 2.035M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hello</p>
            <p className="text-sm font-medium text-gray-900">Smita N</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-0 text-sm shadow-[0px_0px_8px_#000]">
          <div className="px-6 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
            <span className="font-medium text-gray-700 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              My Orders
            </span>
            <span className="text-gray-500">{`>`}</span>
          </div>

          <div className="mt-3 text-gray-700 font-medium px-6">
            Account Setting
          </div>
          <div className="bg-[#edf2ff] text-[#3758f9] px-6 py-2 font-medium">
            Profile Information
          </div>
          <div className="px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            Manage Address
          </div>

          <div className="mt-3 text-gray-700 font-medium px-6">Payment</div>
          <div className="px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            Gift Card
          </div>
          <div className="px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            Saved Card
          </div>

          <div className="mt-3 text-gray-700 font-medium px-6">My Items</div>
          <div className="px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            My Coupon
          </div>
          <div className="px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            My Wishlist
          </div>

          <div className="mt-3 px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 17l-4-4-4 4m8-8l-4 4-4-4" />
            </svg>
            Logout
          </div>
        </nav>
      </aside>

      {/* Right Panel */}
      <main className="w-full">
        <div className="bg-white border rounded-lg shadow-sm p-8 w-full mx-auto">
          <h2 className="text-sm font-semibold text-black mb-6">
            Personal Information
          </h2>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              value="Smita"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm"
            />
            <input
              type="text"
              value="N"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm"
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Your Gender
            </label>
            <div className="flex items-center gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" checked readOnly />
                <span className="text-gray-800">Male</span>
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input type="radio" name="gender" readOnly />
                <span>Female</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value="Smita@gmail.com"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm"
            />
          </div>

          {/* Mobile */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              value="9988776650"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm"
            />
          </div>

          {/* Edit Button */}
          <button className="w-full bg-[#2c3e70] text-white text-sm py-2 rounded font-semibold tracking-wide">
            EDIT
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
