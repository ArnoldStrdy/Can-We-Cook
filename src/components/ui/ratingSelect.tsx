import { Star } from "lucide-react";
import { useState } from "react";

function RatingSelect({ onChange }: { onChange: (_: number) => void }) {
  const [stars, setStars] = useState(0);

  const handleStarClick = (value: number) => {
    const newValue = stars === value ? 0 : value;
    setStars(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex mx-auto gap-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${stars >= value ? "fill-[#FFD233]" : ""}`}
          onClick={() => handleStarClick(value)}
        />
      ))}
    </div>
  );
}

export default RatingSelect;
