function PageNotFound() {
  return (
    <div className="">
      <div className="flex justify-center items-center  h-screen relative">
        {/* image */}
        <img src="images/pageNotFound.png" alt="pagenotfound" />
        {/* text */}
        <div className="absolute text-white flex flex-col justify-center items-center mt-10 pt-16">
          <h2 className="font-zcool text-2xl"> whoops....</h2>
          <p className="font-Poppins">Looks like something went wrong</p>
          <p className="font-Poppins">page Not Found</p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
