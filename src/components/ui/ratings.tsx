import { Star } from "lucide-react";
function Ratings({ stars }: { stars: number }) {
  return (
    <div className="flex mx-auto gap-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${stars >= value ? "fill-[#FFD233]" : ""}`}
        />
      ))}
    </div>
  );
}

export default Ratings;
