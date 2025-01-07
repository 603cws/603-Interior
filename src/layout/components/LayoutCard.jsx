import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
// import Tooltip from '../components/ToolTip'; // Ensure the correct import

const LayoutCard = ({
    image,
    description,
    counterValue,
    onIncrement,
    onDecrement,
    sizes,
    selectedSize,
    onSizeChange,
    tooltipText,
    title,
}) => {
    return (
        <div className="flex flex-col w-[280px] items-center border border-solid bg-[#fff] p-18">
            {/* Image */}
            <div className="bg-red-400">
                <img src={image} alt={title} className="object-cover" />
            </div>
            {/* Content */}
            <div className="flex flex-col mt-2">
                {/* Counter */}
                <div className="flex justify-around mt-2 gap-4">
                    <button onClick={onDecrement}>
                        <CiCircleMinus size={30} />
                    </button>
                    <div className="w-[20px] border-2 rounded-xl px-8 text-center">{counterValue}</div>
                    <button onClick={onIncrement}>
                        <CiCirclePlus size={30} />
                    </button>
                </div>
                {/* Size Options */}
                {sizes && (
                    <div className="flex gap-2 text-sm font-bold mt-4 mb-4 justify-around">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`border-2 rounded-full p-1 ${selectedSize === size ? 'bg-gray-300' : ''}`}
                                onClick={() => onSizeChange(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
                {/* Description */}
                <p className="text-center text-sm">{description}</p>
                <p className="text-center font-bold text-sm">{title}</p>
                {/* Tooltip */}
                {tooltipText && (
                    <div className="tooltip-container">
                        {/* <Tooltip text={tooltipText} /> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LayoutCard;
