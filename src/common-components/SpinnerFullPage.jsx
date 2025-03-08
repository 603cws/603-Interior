// import React, { useState, useEffect } from "react";
// import { Oval } from "react-loader-spinner";

// const SpinnerFullPage = () => {
//   const [size, setSize] = useState(80); // Default size

//   useEffect(() => {
//     const handleResize = () => {
//       setSize(window.innerWidth < 800 ? 40 : 80); // Change size based on window width
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // Set initial size based on current window width

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         width: "100vw",
//       }}
//     >
//       {/* <Oval
//         visible={true}
//         height={size}
//         width={size}
//         color="#1a3a36"
//         radius="12"
//         ariaLabel="three-dots-loading"
//         wrapperStyle={{}}
//         wrapperClass=""
//       /> */}
//       <Oval
//         visible={true}
//         height="80"
//         width="80"
//         color="#1a3a36"
//         ariaLabel="oval-loading"
//         wrapperStyle={{}}
//         wrapperClass=""
//       />
//     </div>
//   );
// };

// export default Loader;

import Spinner from "./Spinner";

import styles from "../styles/spinner.module.css";

function SpinnerFullPage() {
  return (
    <div className={styles.spinnerFullpage}>
      <Spinner />
    </div>
  );
}

export default SpinnerFullPage;
