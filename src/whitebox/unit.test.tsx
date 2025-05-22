// White Box Testing Directory
import { Business, menuItem } from "../pages/WrapperObjects";

// Mock FirebaseAPI functions
jest.mock("../pages/FirebaseAPI", () => ({
  getDocument: jest.fn(() => Promise.resolve({
    exists: true,
    data: () => ({
      menu: [
        { itemID: "1", itemName: "Burger", itemPrice: 10, itemImage: "img.png" }
      ]
    })
  })),
  updateDocument: jest.fn(() => Promise.resolve(true)),
  addDocument: jest.fn(() => Promise.resolve("mockedID")),
}));

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