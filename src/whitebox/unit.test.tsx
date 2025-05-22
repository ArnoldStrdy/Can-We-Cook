// White Box Testing Directory
import { Business, menuItem, Banner } from "../pages/WrapperObjects";

// Mock FirebaseAPI functions
jest.mock("../pages/FirebaseAPI", () => {
  return {
    getDocument: jest.fn((collection, id) => {
      if (collection === "businesses") {
        console.log("Fetching business with ID:", id);
        return Promise.resolve({
          data: {
            businessID: id,
            businessName: "Test",
            businessAddress: "",
            ownerID: "",
            menu: [
                { itemID: "1", itemName: "Burger", itemPrice: 10, itemImage: "img.png" },
                { itemID: "2", itemName: "Pizza", itemPrice: 15, itemImage: "img.png" },
                { itemID: "3", itemName: "Pasta", itemPrice: 12, itemImage: "img.png" },
            ],
            businessDescription: "",
            businessLogo: "",
            cuisineType: "",
            businessPictures: [],
            businessCertifications: [],
            businessLocation: [0, 0],
            weeklyAggregatedReviews: 0,
            weeklyAggregatedScore: 0,
            aggregatedReviews: 0,
            aggregatedScore: 0,
          },
        });
      }
      if (collection === "promotions") {
        return Promise.resolve({
          data: () => ({
            businessID: id,
            bannerID: "banner1",
            imageURL: "https://example.com/banner.jpg",
            expiresAt: Date.now() + 86400000, // 1 day from now
          }),
        });
      }
      return Promise.resolve({ data: () => ({}), broken: true });
    }),
    updateDocument: jest.fn(() => Promise.resolve(true)),
    addDocument: jest.fn(() => Promise.resolve("mockedID")),
    deleteDocument: jest.fn(() => Promise.resolve(true)),
    getAllDocuments: jest.fn((collection) => {
      if (collection === "businesses") {
        return Promise.resolve(
          {data: () => ({
            businessID: "biz1",
            businessName: "Test",
            businessAddress: "",
            ownerID: "",
            menu: [
              { itemID: "1", itemName: "Burger", itemPrice: 10, itemImage: "img.png" },
              { itemID: "2", itemName: "Pizza", itemPrice: 15, itemImage: "img.png" },
              { itemID: "3", itemName: "Pasta", itemPrice: 12, itemImage: "img.png" },
            ],
            businessDescription: "",
            businessLogo: "",
            cuisineType: "",
            businessPictures: [],
            businessCertifications: [],
            businessLocation: [0, 0],
            weeklyAggregatedReviews: 0,
            weeklyAggregatedScore: 0,
            aggregatedReviews: 0,
            aggregatedScore: 0,
          }), id: "000"});
      }
      if (collection === "menu") {
        return Promise.resolve({
          data: () => ({ itemID: "1", itemName: "Burger", itemPrice: 10, itemImage: "img.png" }), id: "000"
        });
      }
      return Promise.resolve({data: () => ({}), id: "000"});
    }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Business Class", () => {
  it("should create a new business", async () => {
    const data = {
      businessName: "Test",
      businessAddress: "",
      ownerID: "ownerID",
      menu: [],
      businessDescription: "",
      businessLogo: "",
      cuisineType: "",
      businessID: undefined,
      businessCertifications: [],
      businessLocation: [0, 0],
      businessPictures: [],
      weeklyAggregatedScore: 0,
      weeklyAggregatedReviews: 0,
      aggregatedReviews: 0,
      aggregatedScore: 0,
    };
    const newBusiness = new Business(data);
    await newBusiness.createBusiness();
    expect(newBusiness.businessID).toBe("mockedID");
  });
  it("should update a business", async () => {
    const data = {
      businessName: "Test",
      businessAddress: "",
      ownerID: "ownerID",
      menu: [],
      businessDescription: "",
      businessLogo: "",
      cuisineType: "",
      businessID: "mockedID",
      businessCertifications: [],
      businessLocation: [0, 0],
      businessPictures: [],
      weeklyAggregatedScore: 0,
      weeklyAggregatedReviews: 0,
      aggregatedReviews: 0,
      aggregatedScore: 0,
    };
    const newBusiness = new Business(data);
    newBusiness.setAggregatedReviews(10);
    newBusiness.setAggregatedScore(4.5);
    newBusiness.setBusinessName("New Name");
    newBusiness.setBusinessAddress("New Address");
    newBusiness.setBusinessDescription("New Description");
    newBusiness.setCuisineType("New Cuisine");
    newBusiness.setBusinessLogo("New Logo");
    expect(newBusiness.businessName).toBe("New Name");
    expect(newBusiness.businessAddress).toBe("New Address");
    expect(newBusiness.businessDescription).toBe("New Description");
    expect(newBusiness.cuisineType).toBe("New Cuisine");
    expect(newBusiness.businessLogo).toBe("New Logo");
    expect(newBusiness.aggregatedReviews).toBe(10);
    expect(newBusiness.aggregatedScore).toBe(4.5);
  });
  it("should fetch a business", async () => {
    const business = new Business();
    await business.initBusiness("biz1");
  });
  it("should modify a menu item", async () => {
    const business = new Business();
    await business.initBusiness("biz1");
    const menuItem = business.menu[0];
    menuItem.setItemName("New Burger");
    menuItem.setItemPrice(12);
    menuItem.setItemImage("newImg.png");
    expect(menuItem.itemName).toBe("New Burger");
    expect(menuItem.itemPrice).toBe(12);
    expect(menuItem.itemImage).toBe("newImg.png");
  });
  it("should add a menu item", async () => {
    const business = new Business();
    await business.initBusiness("biz1");
    const newMenuItem = new menuItem("New Item", "4", 20, "newImg.png", "biz1");
    business.menu.push(newMenuItem);
    expect(business.menu.length).toBe(4);
  });
});

describe("Menu Class", () => {
  it("should create a new menu item", async () => {
    const newMenuItem = new menuItem("Burger", "1", 10, "img.png", "biz1");
    expect(newMenuItem.itemID).toBe("1");
  });
  it("should update a menu item", async () => {
    const newMenuItem = new menuItem("Burger", "1", 10, "img.png", "biz1");
    newMenuItem.setItemName("New Burger");
    newMenuItem.setItemPrice(12);
    newMenuItem.setItemImage("newImg.png");
    expect(newMenuItem.itemName).toBe("New Burger");
    expect(newMenuItem.itemPrice).toBe(12);
    expect(newMenuItem.itemImage).toBe("newImg.png");
  });
});

describe("Banner Class", () => {
  it("should create a new banner", async () => {
    const newBanner = new Banner("biz1", "https://example.com/banner.jpg");
    expect(newBanner.businessID).toBe("biz1");
    expect(newBanner.imageURL).toBe("https://example.com/banner.jpg");
  });
});