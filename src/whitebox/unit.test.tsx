// White Box Testing Directory
import { Business, menuItem } from "../pages/WrapperObjects";

// Mock FirebaseAPI functions
jest.mock("../pages/FirebaseAPI", () => {
  return {
    getDocument: jest.fn((collection, id) => {
      if (collection === "businesses") {
        return Promise.resolve({
          data: () => ({
            businessID: id,
            businessName: "Test",
            businessAddress: "",
            ownerID: "",
            menu: [],
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
          }),
        });
      }
      if (collection === "menu") {
        return Promise.resolve({
          data: () => ({
            menu: [
              { itemID: "1", itemName: "Burger", itemPrice: 10, itemImage: "img.png" },
              { itemID: "2", itemName: "Pizza", itemPrice: 15, itemImage: "img.png" },
              { itemID: "3", itemName: "Pasta", itemPrice: 12, itemImage: "img.png" },
            ],
          }),
        });
      }
      return Promise.resolve({ data: () => ({}) });
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

describe("menuItem class", () => {
  it("should return correct item data", () => {
    const item = new menuItem("Pizza", "123", 15, "pizza.png", "biz1");
    expect(item.getItem()).toEqual({
      itemName: "Pizza",
      itemID: "123",
      itemPrice: 15,
      itemImage: "pizza.png",
    });
  });

  it("should call updateDocument when setItemName is called", async () => {
    const item = new menuItem("Burger", "1", 10, "img.png", "biz1");
    await item.setItemName("Cheeseburger");
    const { updateDocument } = require("../pages/FirebaseAPI");
    expect(updateDocument).toHaveBeenCalled();
  });
});

describe("Business class", () => {
  it("should initialize with default values", () => {
    const business = new Business();
    expect(business.businessName).toBe("");
    expect(business.menu).toEqual([]);
  });

  it("should set business name and call updateDocument", async () => {
    const business = new Business({ businessID: "biz1", businessName: "Test", businessAddress: "", ownerID: "", menu: [], businessDescription: "", businessLogo: "", cuisineType: "", businessPictures: [], businessCertifications: [], businessLocation: [0,0], weeklyAggregatedReviews: 0, weeklyAggregatedScore: 0, aggregatedReviews: 0, aggregatedScore: 0 });
    await business.setBusinessName("New Name");
    const { updateDocument } = require("../pages/FirebaseAPI");
    expect(updateDocument).toHaveBeenCalledWith("businesses", "biz1", { businessName: "New Name" });
  });
});
describe("menuItem class methods", () => {
  it("should set item name", async () => {
    const item = new menuItem("Burger", "1", 10, "img.png", "biz1");
    await item.setItemName("Cheeseburger");
    expect(item.itemName).toBe("Cheeseburger");
  });

  it("should set item price", async () => {
    const item = new menuItem("Burger", "1", 10, "img.png", "biz1");
    await item.setItemPrice(12);
    expect(item.itemPrice).toBe(12);
  });
});
describe("Business class methods", () => {
  it("should set business name", async () => {
    const business = new Business({ businessID: "biz1", businessName: "Test", businessAddress: "", ownerID: "", menu: [], businessDescription: "", businessLogo: "", cuisineType: "", businessPictures: [], businessCertifications: [], businessLocation: [0,0], weeklyAggregatedReviews: 0, weeklyAggregatedScore: 0, aggregatedReviews: 0, aggregatedScore: 0 });
    await business.setBusinessName("New Name");
    expect(business.businessName).toBe("New Name");
  });

  it("should set business address", async () => {
    const business = new Business({ businessID: "biz1", businessName: "Test", businessAddress: "", ownerID: "", menu: [], businessDescription: "", businessLogo: "", cuisineType: "", businessPictures: [], businessCertifications: [], businessLocation: [0,0], weeklyAggregatedReviews: 0, weeklyAggregatedScore: 0, aggregatedReviews: 0, aggregatedScore: 0 });
    await business.setBusinessAddress("New Address");
    expect(business.businessAddress).toBe("New Address");
  });
});
