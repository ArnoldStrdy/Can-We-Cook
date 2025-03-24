import { Star } from "lucide-react";

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
        <Star
          key={value}
          className={`${rating >= value ? "fill-[#FFD233]" : ""}`}
          onClick={() => handleStarClick(value)}
        />
      ))}
    </div>
  );
}

export default RatingSelect;
