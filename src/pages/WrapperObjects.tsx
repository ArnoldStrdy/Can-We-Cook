
import { addDocument, app, getCollection, getDocument, updateDocument } from "./FirebaseAPI"
import { firestore } from "./FirebaseAPI"

class menuItem {
    businessID: string;
    itemName: string;
    itemID: string;
    itemPrice: number;
    itemImage: string | undefined;
    constructor(itemName: string, itemID: string, itemPrice: number, itemImage?: string, businessID?: string) {
        this.itemName = itemName;
        this.itemID = itemID;
        this.itemPrice = itemPrice;
        this.itemImage = itemImage;
        this.businessID = businessID || "";
    }
    public getItem() {
        return {
            itemName: this.itemName,
            itemID: this.itemID,
            itemPrice: this.itemPrice,
            itemImage: this.itemImage
        }
    }
    setItemName(itemName: string) {
        this.itemName = itemName;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        getDocument('businesses', this.businessID).then((doc) => {
            if (doc.exists) {
                updateDocument('businesses', this.businessID, { 
                    menu: doc.data().menu.map((item: menuItem) => item.itemID === this.itemID ? this : item) 
                }).then((bool) => {
                    if (bool) {
                        console.log("Item name updated successfully");
                    } else {
                        console.error("Error updating item name");
                    }
                });
            }
        });
    }
    setItemPrice(itemPrice: number) {
        this.itemPrice = itemPrice;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        getDocument('businesses', this.businessID).then((doc) => {
            if (doc.exists) {
                updateDocument('businesses', this.businessID, { 
                    menu: doc.data().menu.map((item: menuItem) => item.itemID === this.itemID ? this : item) 
                }).then((bool) => {
                    if (bool) {
                        console.log("Item price updated successfully");
                    } else {
                        console.error("Error updating item price");
                    }
                });
            }
        });
    }
    setItemImage(itemImage: string) {
        this.itemImage = itemImage;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        getDocument('businesses', this.businessID).then((doc) => {
            if (doc.exists) {
                updateDocument('businesses', this.businessID, { 
                    menu: doc.data().menu.map((item: menuItem) => item.itemID === this.itemID ? this : item) 
                }).then((bool) => {
                    if (bool) {
                        console.log("Item image updated successfully");
                    } else {
                        console.error("Error updating item image");
                    }
                });
            }
        });
    }
}

interface businessData {
    businessID: string | undefined;
    businessName: string;
    businessCertifications: Array<string> | undefined;
    businessLocation: number[] | undefined;
    businessAddress: string;
    businessLogo: string;
    cuisineType: string;
    businessPictures: Array<string>;
    ownerID: string;
    menu: Array<menuItem>;
    weeklyAggregatedScore: number;
    weeklyAggregatedReviews: number;
    businessDescription: string;
}

class Business{
    collection: string = "businesses";
    businessID: string | undefined;
    businessName: string;
    businessCertifications: Array<string> | undefined;
    businessLocation: number[] | undefined;
    businessAddress: string;
    businessLogo: string;
    cuisineType: string;
    businessPictures: Array<string>;
    ownerID: string;
    menu: Array<menuItem>;
    weeklyAggregatedScore: number;
    weeklyAggregatedReviews: number;
    businessDescription: string;
    constructor(
        businessData?: businessData | string
    ) {
        if (typeof businessData === "string") {
            getDocument(this.collection, businessData).then((doc) => {
                if (doc.exists) {
                    this.businessName = doc.data().businessName;
                    this.businessAddress = doc.data().businessAddress;
                    this.ownerID = doc.data().ownerID;
                    this.menu = doc.data().menu.map((item: menuItem) => new menuItem(item.itemName, item.itemID, item.itemPrice, item.itemImage, doc.id));
                    this.businessDescription = doc.data().businessDescription;
                    this.businessLogo = doc.data().businessLogo;
                    this.cuisineType = doc.data().cuisineType;
                    this.businessPictures = doc.data().businessPictures;
                    this.businessID = doc.id;
                    this.businessCertifications = doc.data().businessCertifications;
                    this.businessLocation = doc.data().businessLocation;
                    this.weeklyAggregatedReviews = doc.data().weeklyAggregatedReviews;
                    this.weeklyAggregatedScore = doc.data().weeklyAggregatedScore;
                }
            });
        }
        
        if (typeof businessData !== "string" && businessData !== undefined) {
            this.businessName = businessData.businessName || "";
            this.businessAddress = businessData.businessAddress || "";
            this.ownerID = businessData.ownerID || "";
            this.menu = businessData.menu || [];
            this.businessDescription = businessData.businessDescription || "";
            this.businessLogo = businessData.businessLogo || "";
            this.cuisineType = businessData.cuisineType || "";
            this.businessPictures = businessData.businessPictures || [];
            this.businessID = businessData.businessID;
            this.businessCertifications = businessData.businessCertifications || [];
            this.businessLocation = businessData.businessLocation ?? [0, 0];
            this.weeklyAggregatedReviews = businessData.weeklyAggregatedReviews ?? 0;
            this.weeklyAggregatedScore = businessData.weeklyAggregatedScore ?? 0;
        } else {
            this.businessName = "";
            this.businessAddress = "";
            this.ownerID = "";
            this.menu = [];
            this.businessDescription = "";
            this.businessLogo = "";
            this.cuisineType = "";
            this.businessPictures = [];
            this.businessID = undefined;
            this.businessCertifications = [];
            this.businessLocation = [0, 0];
            this.weeklyAggregatedReviews = 0;
            this.weeklyAggregatedScore = 0;
        }
        
    }
    createBusiness() {
        if (this.businessID !== undefined) {
            console.error("Business already exists");
            return;
        }
        const data = {
            businessName: this.businessName,
            businessAddress: this.businessAddress,
            ownerID: firestore().doc("owners/" + this.ownerID.toString()),
            menu: this.menu.map((item) => item.getItem()),
            businessDescription: this.businessDescription,
            businessLogo: this.businessLogo,
            cuisineType: this.cuisineType,
            businessPictures: this.businessPictures,
            businessCertifications: this.businessCertifications,
            businessLocation: this.businessLocation,
            weeklyAggregatedReviews: this.weeklyAggregatedReviews,
            weeklyAggregatedScore: this.weeklyAggregatedScore
        }
        addDocument(this.collection, data).then((id) => {
            if (id != "") {
                this.businessID = id;
                console.log("Business added successfully");
            }
            else {
                console.error("Error adding business");
            }
        }).catch((error) => {
            console.error("Error adding business: ", error);
        });
    }
    setBusinessName(businessName: string) {
        this.businessName = businessName;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        updateDocument(this.collection, this.businessID, { businessName: businessName }).then((bool) => {
            if (bool) {
                console.log("Business name updated successfully");
            } else {
                console.error("Error updating business name");
            }
        });
    }
    setBusinessAddress(businessAddress: string) {
        this.businessAddress = businessAddress;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        updateDocument(this.collection, this.businessID, { businessAddress: businessAddress }).then((bool) => {
            if (bool) {
                console.log("Business address updated successfully");
            } else {
                console.error("Error updating business address");
            }
        });
    }
    setBusinessLogo(businessLogo: string) {
        this.businessLogo = businessLogo;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        updateDocument(this.collection, this.businessID, { businessLogo: businessLogo }).then((bool) => {
            if (bool) {
                console.log("Business logo updated successfully");
            } else {
                console.error("Error updating business logo");
            }
        });
    }
    setCuisineType(cuisineType: string) {
        this.cuisineType = cuisineType;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        updateDocument(this.collection, this.businessID, { cuisineType: cuisineType }).then((bool) => {
            if (bool) {
                console.log("Cuisine type updated successfully");
            } else {
                console.error("Error updating cuisine type");
            }
        });
    }
    setBusinessDescription(businessDescription: string) {
        this.businessDescription = businessDescription;
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        updateDocument(this.collection, this.businessID, { businessDescription: businessDescription }).then((bool) => {
            if (bool) {
                console.log("Business description updated successfully");
            } else {
                console.error("Error updating business description");
            }
        });
    }
    getAllReviews() {
        if (this.businessID === undefined) {
            console.error("Business ID is undefined");
            return;
        }
        const data: Array<Review> = [];
        firestore.collection("reviews").where("businessID", "==", this.businessID).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(new Review(doc.id, doc.data().customerID, doc.data().businessID, doc.data().dateTime, doc.data().reviewText, doc.data().verified, doc.data().rating));
            });
        });
        return data;
    }
}
class Customer{
    customerID: string;
    name: string;
    uid: string;
    ProfilePic: string;
}
class Review{
    collection: string = "reviews";
    reviewID: string;
    customerID: string;
    businessID: string;
    dateTime: Date;
    reviewText: string;
    verified: boolean;
    rating: number;
    constructor(reviewID: string, customerID: string, businessID: string, 
                dateTime: Date, reviewText: string, verified: boolean, rating: number) {
        this.reviewID = reviewID;
        this.customerID = customerID;
        this.businessID = businessID;
        this.dateTime = dateTime;
        this.reviewText = reviewText;
        this.verified = verified;
        this.rating = rating;
    }
    public createReview() {
        const data = {
            customerID: this.customerID,
            businessID: this.businessID,
            dateTime: this.dateTime,
            reviewText: this.reviewText,
            verified: this.verified,
            rating: this.rating
        }
        addDocument(this.collection, data).then((bool) => {
            if (bool) {
                console.log("Review added successfully");
            }
            else {
                console.error("Error adding review");
            }
        }).catch((error) => {
            console.error("Error adding review: ", error);
        });
    }
}
class Owner{
    ownerID: string;
    name: string;
    uid: string;
}
export { Business, menuItem, Customer, Review, Owner };
export type { businessData };

