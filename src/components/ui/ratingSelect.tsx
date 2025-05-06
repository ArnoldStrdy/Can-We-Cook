import { Star } from "lucide-react";
import { IoStar } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";

function RatingSelect({
  onChange,
  rating,
}: {
  onChange: (_: number) => void;
  rating: number;
}) {
  const handleStarClick = (value: number) => {
    const newValue = rating === value ? 0 : value;
    onChange(newValue);
  };
  return (
    <div className="flex mx-auto gap-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        // <Star
        //   key={value}
        //   className={`${rating >= value ? "fill-[#FFD233]" : ""}`}
        //   onClick={() => handleStarClick(value)}
        // />
        <span key={value} className="flex items-center justify-center">
          {rating >= value ? (
            <IoStar
              className="fill-[#554971] text-2xl hover:cursor-pointer"
              onClick={() => handleStarClick(value)}
            />
          ) : (
            <IoStarOutline
              className="text-[#554971] text-2xl hover:cursor-pointer"
              onClick={() => handleStarClick(value)}
            />
          )}
        </span>
      ))}
    </div>
  );
}

export default RatingSelect;
