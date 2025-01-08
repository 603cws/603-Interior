function Spacebar() {
    return (
        <div className="flex w-full border-2 overflow-hidden bg-[#385682] my-3  h-8">
            {/* used space */}
            <div className="bg-[#54DED3] text-white w-3/4 border-1 rounded-r-xl text-sm content-center">
                <p className="px-4">Used space</p>
            </div>
            {/* unused space */}
            <div className="bg-[#385682] text-white w-1/4 text-sm content-center">
                <p className="px-4">Unused space</p>
            </div>
        </div>
    )
}

export default Spacebar
