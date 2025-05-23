import { useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { TPromotion } from "@/Types/RestaurantTypes";
import { useNavigate } from "react-router-dom";

export const PromotionCarousel = ({ promotions }: { promotions: TPromotion[] }) => {
    const [api, setApi] = useState<CarouselApi>();

    const intervalTime = 3000;
    useEffect(() => {
      setInterval(() => {
        api?.scrollNext();
      }, intervalTime);
    }, [api]);
    const navigate = useNavigate()
    return (
      <Carousel
        setApi={setApi}
        className="max-w-7xl"
        opts={{ align: "center", loop: true }}
      >
        <CarouselContent>
          {promotions?.map((promotion) => (
            <CarouselItem
              className={`basis-1/${
                promotions.length < 3 ? promotions.length : 3
              }`}
              onClick={() => navigate(`/restaurant/${promotion.businessID}`)}
              key={promotion.promotionID}
            >
              <div className="flex items-center justify-center h-36 sm:h-72 bg-gray-200/40 rounded-lg p-1">
                <img
                  src={promotion.imageURL}
                  className="object-cover max-h-full cursor-pointer"
                  alt={promotion.promotionID}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {promotions.length > 3 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    );
  };