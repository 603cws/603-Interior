import React, { useState, useEffect } from "react";
import "animate.css";
import { useApp } from "../../Context/Context";

const QnaPopup = ({ onClose, onSubmit }) => {
  const { selectedCategory } = useApp();
  const categoryName = selectedCategory?.category || ""; // Safely access the category name

  // Height question (always the first question)
  const heightQuestion = [
    {
      name: "roomHeight",
      label: "Enter the height of the room (in feet). Default is 10ft.",
      isNumberInput: true,
      ImageUrl: "/images/flooringimg.png",
    },
  ];

  // Questions for Flooring
  const flooringQuestions = [
    {
      name: "flooringStatus",
      label: "What is the flooring status?",
      options: [
        { value: "bareShell", label: "Bare Shell" },
        { value: "basicTiling", label: "Basic Tiling Done" },
      ],
      ImageUrl: "/images/Flooringquestion.gif",
    },
  ];

  const demolishTileQuestion = [
    {
      name: "demolishTile",
      label: "Do you want to demolish existing tile?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      ImageUrl: "/images/Chat-bot.gif",
    },
  ];

  // AC question
  const hvacQuestions = [
    {
      name: "hvacType",
      label: "Do you want full centralized AC or a combination?",
      options: [
        { value: "Centralized", label: "Centralized" },
        { value: "Combination", label: "Combination" },
      ],
      ImageUrl: "/images/HVAC.gif",
    },
  ];

  // partition/ceiling
  const partitionQuestions = [
    {
      name: "partitionArea",
      label: "Do you want the same partition to all areas or customize?",
      options: [
        { value: "allArea", label: "All Areas" },
        { value: "customizeAreas", label: "Customize Areas" },
      ],
      ImageUrl: "/images/Chat-bot.gif",
    },
  ];

  const [questions, setQuestions] = useState(heightQuestion);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [animationClass, setAnimationClass] = useState("animate__fadeInUp");

  useEffect(() => {
    const savedAnswers = localStorage.getItem("answers");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
  }, []);

  useEffect(() => {
    // Dynamically set questions based on category name
    if (categoryName === "Flooring") {
      setQuestions([...flooringQuestions]);
    } else if (categoryName === "HVAC") {
      setQuestions([...hvacQuestions]);
    } else if (categoryName === "Partitions / Ceilings") {
      setQuestions([...partitionQuestions]);
    } else {
      setQuestions(heightQuestion); // Default to height question if no category matches
    }
  }, [categoryName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedAnswers = { ...answers, [name]: value };
    console.log(updatedAnswers);

    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));

    // If flooringStatus is selected, check for the demolishTile question
    if (questions.length < 2) {
      if (name === "flooringStatus" && value === "basicTiling") {
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          ...demolishTileQuestion, // Add demolish tile question if Basic Tiling is selected
        ]);
      }
    }

    //set the question array to default question 1st if value is bareshell
    if (name === "flooringStatus" && value === "bareShell") {
      setQuestions(flooringQuestions);
    }
  };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const updatedAnswers = { ...answers, [name]: value };
  //   console.log(updatedAnswers);

  //   setAnswers(updatedAnswers);
  //   localStorage.setItem("answers", JSON.stringify(updatedAnswers));

  //   // If flooringStatus is selected, check for the demolishTile question
  //   if (questions.length < 2) {
  //     if (name === "flooringStatus" && value === "basicTiling") {
  //       setQuestions((prevQuestions) => [
  //         ...prevQuestions,
  //         ...demolishTileQuestion, // Add demolish tile question if Basic Tiling is selected
  //       ]);
  //     }
  //   }

  //   //set the question array to default question 1st if value is bareshell
  //   if (name === "flooringStatus" && value === "bareShell") {
  //     setQuestions(flooringQuestions);
  //   }
  // };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    if (
      currentQuestion.name === "demolishTile" &&
      answers[currentQuestion.name] === "yes"
    ) {
      setShowDisclaimer(true);
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      const finalAnswers = {
        ...answers,
        roomHeight: answers.roomHeight || 10,
      };
      setAnimationClass("animate__fadeOutUp");
      setTimeout(() => {
        onSubmit(finalAnswers);
        onClose();
      }, 300); // Adjust this delay based on animation duration
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const sideImage = currentQuestion?.ImageUrl;

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      onSubmit(answers); // Submit answers if all questions are done
      onClose(); // Close the modal
    }
  };
  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleHeightClose = () => {
    if (!answers.roomHeight) {
      answers.roomHeight = 10;
    }
    setAnimationClass("animate__fadeOutUp");
    setTimeout(onClose, 300);
  };

  // console.log("questions", questions);
  // console.log("answers", answers.roomHeight);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white border-[20px] border-[#1A3A36] rounded-xl shadow-lg relative w-3/5 h-1/2 animate__animated ${animationClass} flex flex-row-reverse `}
      >
        {/* Left Side: Image */}
        <div
          className="w-1/2 bg-contain bg-no-repeat bg-center border-2 border-[#ffd500] border-l-0"
          style={{
            backgroundImage: `url(${sideImage})`,
          }}
        ></div>

        {/* Right Side: Questions */}
        <div className="w-1/2 p-6 border-2 border-[#ffd500] border-r-0 flex flex-col items-center justify-center">
          <button
            onClick={handleHeightClose}
            disabled={Object.keys(answers).length === 0} // Disable if no answers
            className={`absolute top-4 right-4 text-2xl font-bold ${
              Object.keys(answers).length === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            &times;
          </button>

          {!showDisclaimer ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-bold mb-4 text-center">
                Answer These Questions
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    {currentQuestionIndex + 1}. {currentQuestion.label}
                  </label>
                  <div className="my-4 flex justify-around items-center">
                    {currentQuestion.isNumberInput ? (
                      <input
                        type="number"
                        name={currentQuestion.name}
                        // value={answers[currentQuestion.name] || 10}
                        // value={answers.roomHeight}
                        onChange={handleInputChange}
                        placeholder="Enter height (default is 10)"
                        min="5"
                        max="16"
                        className="w-full border-2 rounded-md p-2 [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                      />
                    ) : (
                      currentQuestion.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-1 text-xs"
                        >
                          <input
                            type="radio"
                            name={currentQuestion.name}
                            value={option.value}
                            onChange={handleInputChange}
                            checked={
                              answers[currentQuestion.name] === option.value
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex justify-around ">
                  {currentQuestionIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePreviousClick}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={Object.keys(answers).length === 0} // Disable if no answers
                    className={`px-4 py-2 rounded ${
                      Object.keys(answers).length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#1A3A36] text-white hover:bg-[#145A50]"
                    }`}
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? "Next"
                      : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <p className="text-md text-center">
                Demolishment charges might depend upon the location.
              </p>
              <div className="flex justify-center">
                <button
                  className="bg-[#1A3A36] text-white px-4 py-2 rounded hover:bg-[#145A50]"
                  onClick={handleDisclaimerClose}
                >
                  Okay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QnaPopup;
