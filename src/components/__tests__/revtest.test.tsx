import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getDocs, Timestamp } from "firebase/firestore";
import { BrowserRouter } from "react-router-dom";
import { AllBusiness } from "../custom/AllBusiness";
import { ReviewsTabContent } from "@/pages/RestaurantDetails";
import {
  IExistingMenu,
  IExistingReview,
  TPromotion,
} from "@/Types/RestaurantTypes";
import { PromotionCarousel } from "../custom/PromotionCarousel";
import { MenuTabContent } from "../custom/MenuTabContent";

// Mock Firebase Firestore
vi.mock("firebase/firestore", () => ({
  // ...actualFirestore,
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(() => "mockedCollection"),
  getDocs: vi.fn(),
  Timestamp: {
    fromDate: (date: Date) => ({
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: 0,
      toDate: () => date,
    }),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Shadcn Carousel
vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselItem: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  CarouselPrevious: () => <button>Previous</button>,
  CarouselNext: () => <button>Next</button>,
}));

const mockPromotions: TPromotion[] = [
  {
    promotionID: "1",
    imageURL: "/img1.png",
    businessID: "bus1",
  },
  {
    promotionID: "2",
    imageURL: "/img2.png",
    businessID: "bus2",
  },
];

describe("Customer Dashboard", () => {
  it("Loads and displays restaurants", async () => {
    (getDocs as vi.Mock).mockResolvedValue({
      docs: [
        {
          data: () => ({
            businessName: "Sample Restaurant 1",
            aggregatedScore: 20,
            aggregatedReviews: 4,
            businessLogo: "img.png",
            businessId: "1",
          }),
        },
        {
          data: () => ({
            businessName: "Sample Restaurant 2",
            aggregatedScore: 20,
            aggregatedReviews: 4,
            businessLogo: "img.png",
            businessId: "2",
          }),
        },
      ],
    });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AllBusiness />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Sample Restaurant 1")).toBeInTheDocument();
      expect(screen.getByText("Sample Restaurant 2")).toBeInTheDocument();
    });
  });
});

describe("Promotion Banner", () => {
  it("Loads and displays promotion carousel", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PromotionCarousel promotions={mockPromotions} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const image1 = screen.getByAltText("1");
      expect(image1).toBeInTheDocument()
      expect(image1).toHaveAttribute("src", "/img1.png");
      
      const image2 = screen.getByAltText("2");
      expect(image2).toBeInTheDocument()
      expect(image2).toHaveAttribute("src", "/img2.png");
    });
  });

  it("OnClick navigation is correctly implemented", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PromotionCarousel promotions={mockPromotions} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const image1 = screen.getByAltText("1");
      fireEvent.click(image1.closest("div")!);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/restaurant/${mockPromotions[0].businessID}`
      );

      const image2 = screen.getByAltText("2");
      fireEvent.click(image2.closest("div")!);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/restaurant/${mockPromotions[1].businessID}`
      );
    });
  })
});

const yesterday = new Date();
yesterday.setDate(new Date().getDate() - 1);
const mockReviews: IExistingReview[] = [
  {
    pictures: [],
    reviewId: "1",
    customerName: "Bob",
    anonymous: false,
    dateTime: Timestamp.fromDate(new Date()),
    rating: 5,
    reviewText: "Good Food",
    verified: false,
  },
  {
    pictures: [],
    reviewId: "2",
    customerName: "Jack",
    anonymous: false,
    dateTime: Timestamp.fromDate(yesterday),
    rating: 5,
    reviewText: "Good restaurant",
    verified: false,
  },
];

const mockMenuItems: IExistingMenu[] = [
  {
    itemID: "1",
    itemName: "MenuItem1",
    itemPrice: 10,
    itemImage: "/item1.png",
  },
  {
    itemID: "2",
    itemName: "MenuItem2",
    itemPrice: 5.5,
    itemImage: "/item2.png",
  },
];

describe("Restaurant Details", () => {
  it("Loads and displays reviews", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ReviewsTabContent reviews={mockReviews} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Good Food")).toBeInTheDocument();
      expect(
        screen.getByText(new Date().toLocaleDateString("en-AU"))
      ).toBeInTheDocument();
      expect(screen.getByText("Jack")).toBeInTheDocument();
      expect(screen.getByText("Good restaurant")).toBeInTheDocument();
      expect(
        screen.getByText(yesterday.toLocaleDateString("en-AU"))
      ).toBeInTheDocument();
    });
  });

  it("Loads and displays menu items", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MenuTabContent menu={mockMenuItems} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("MenuItem1")).toBeInTheDocument();
      expect(screen.getByText(/\$\s*10/)).toBeInTheDocument();
      expect(screen.getByText("MenuItem2")).toBeInTheDocument();
      expect(screen.getByText(/\$\s*5.5/)).toBeInTheDocument();
      const image1 = screen.getByAltText("1");
      expect(image1).toHaveAttribute("src", "/item1.png");
      const image2 = screen.getByAltText("2");
      expect(image2).toHaveAttribute("src", "/item2.png");
    });
  });
});
