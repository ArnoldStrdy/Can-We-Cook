import { IoStar } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";

function Ratings({ stars }: { stars: number }) {
  return (
    <div className="flex mx-auto gap-x-1 p-0.5 align-middle justify-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value} className="flex items-center justify-center">
          {stars >= value ? (
            <IoStar className="fill-[#554971] text-2xl" />
          ) : (
            <IoStarOutline className="text-[#554971] text-2xl" />
          )}
        </span>
      ))}
    </div>
  );
}

export default Ratings;
