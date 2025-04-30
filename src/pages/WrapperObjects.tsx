import {
  addDocument,
  app,
  getCollection,
  getDocument,
  updateDocument,
} from "./FirebaseAPI";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firestore, DocumentData } from "./FirebaseAPI";
import { Cron } from "croner"

const weeklyCronJob = new Cron("0 0 * * 0", async () => {
  console.log("Running weekly cron job...");

  try {
    // Fetch all businesses
    const businesses = await getCollection("businesses");

    // Reset weekly aggregated scores and reviews for each business
    if (!businesses) {
      console.error("No businesses found.");
      return;
    }
    for (const business of businesses.docs) {
      const businessID = business.id;
      const buisness = new Business();
      await buisness.initBusiness(businessID);
      const reviewsSnapshot = await firestore.collection("reviews")
        .where("businessID", "==", doc(firestore, "businesses", businessID)
      ).get();
      const reviews = reviewsSnapshot.docs.map((doc) => {
        const data = new Review(
          doc.id,
          doc.data().customerID,
          doc.data().businessID,
          doc.data().dateTime.toDate(),
          doc.data().reviewText,
          doc.data().verified,
          doc.data().rating
        )
        return data;
      });
      const aggregatedScore = reviews?.reduce(
        (acc: number, review: Review) => acc + review.rating,
        0
      );
      const aggregatedReviews = reviews?.length;
      const today = new Date();
      const priorDate = new Date()
      priorDate.setDate(today.getDate() - 7);
      const weeklyReviews = reviews?.filter(
        (review: Review) => {
          console.log(review.dateTime, priorDate, today);
          console.log(review.dateTime >= priorDate, review.dateTime <= today);
          return review.dateTime >= priorDate && review.dateTime <= today
        }
      );
      const weeklyAggregatedScore = weeklyReviews?.reduce(
        (acc: number, review: Review) => acc + review.rating,
        0
      );
      const weeklyAggregatedReviews = weeklyReviews?.length;
      console.log(
        `Business ID: ${businessID}, Aggregated Score: ${aggregatedScore}, Aggregated Reviews: ${aggregatedReviews}, Weekly Aggregated Score: ${weeklyAggregatedScore}, Weekly Aggregated Reviews: ${weeklyAggregatedReviews}`
      );
      buisness.setAggregatedScore(aggregatedScore || 0);
      buisness.setAggregatedReviews(aggregatedReviews || 0);
      buisness.setweeklyAggregatedScore(weeklyAggregatedScore || 0);
      buisness.setweeklyAggregatedReviews(weeklyAggregatedReviews || 0);
      console.log(`Reset weekly data for business ID: ${businessID}`);
    }
    console.log("Weekly cron job completed successfully.");
  } catch (error) {
    console.error("Error running weekly cron job:", error);
  }
});

class menuItem {
  businessID: string;
  itemName: string;
  itemID: string;
  itemPrice: number;
  itemImage: string | undefined;
  constructor(
    itemName: string,
    itemID: string,
    itemPrice: number,
    itemImage?: string,
    businessID?: string
  ) {
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
      itemImage: this.itemImage,
    };
  }
  setItemName(itemName: string) {
    this.itemName = itemName;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    getDocument("businesses", this.businessID).then((doc) => {
      if (doc.exists) {
        updateDocument("businesses", this.businessID, {
          menu: doc
            .data()
            .menu.map((item: menuItem) =>
              item.itemID === this.itemID ? this : item
            ),
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
    getDocument("businesses", this.businessID).then((doc) => {
      if (doc.exists) {
        updateDocument("businesses", this.businessID, {
          menu: doc
            .data()
            .menu.map((item: menuItem) =>
              item.itemID === this.itemID ? this : item
            ),
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
    getDocument("businesses", this.businessID).then((doc) => {
      if (doc.exists) {
        updateDocument("businesses", this.businessID, {
          menu: doc
            .data()
            .menu.map((item: menuItem) =>
              item.itemID === this.itemID ? this : item
            ),
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

type businessData = {
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
  aggregatedReviews: number;
  aggregatedScore: number;
  businessDescription: string;
};

class Business {
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
  aggregatedReviews: number;
  aggregatedScore: number;
  businessDescription: string;
  constructor(businessData?: businessData | string) {
    if (typeof businessData == "string") {
      this.initBusiness(businessData);
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
      this.aggregatedReviews = businessData.aggregatedReviews ?? 0;
      this.aggregatedScore = businessData.aggregatedScore ?? 0;
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
      this.aggregatedReviews = 0;
      this.aggregatedScore = 0;
    }
  }
  async initBusiness(businessID: string | undefined) {
    if (businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    const doc = await getDocument(this.collection, businessID);
    if (!doc) {
      console.error("Document not found");
      return;
    }
    if (doc) {
      //console.log(doc.data)
      this.businessName = doc.data.businessName;
      this.businessAddress = doc.data.businessAddress;
      this.ownerID = doc.data.ownerID;
      this.menu = doc.data.menu.map((item: any) => {
        return new menuItem(
          item.itemName,
          item.itemID,
          item.itemPrice,
          item.itemImage,
          doc.id
        );
      });
      this.businessDescription = doc.data.businessDescription;
      this.businessLogo = doc.data.businessLogo;
      this.cuisineType = doc.data.cuisineType;
      this.businessPictures = doc.data.businessPictures;
      this.businessID = doc.id;
      this.businessCertifications = doc.data.businessCertifications;
      this.businessLocation = doc.data.businessLocation;
      this.weeklyAggregatedReviews = doc.data.weeklyAggregatedReviews;
      this.weeklyAggregatedScore = doc.data.weeklyAggregatedScore;
      this.aggregatedReviews = doc.data.aggregatedReviews;
      this.aggregatedScore = doc.data.aggregatedScore;
    }
    console.log(this);
    //console.log("Business ID: " + businessData);
    return;
  }
  createBusiness() {
    console.log("Creating business...");
    if (this.businessID !== undefined) {
      console.error("Business already exists");
      return;
    }
    console.log(this.ownerID);
    const data = {
      businessName: this.businessName,
      businessAddress: this.businessAddress,
      ownerID: this.ownerID,
      menu: this.menu.map((item) => item.getItem()),
      businessDescription: this.businessDescription,
      businessLogo: this.businessLogo,
      cuisineType: this.cuisineType,
      businessPictures: this.businessPictures,
      businessCertifications: this.businessCertifications,
      businessLocation: this.businessLocation,
      weeklyAggregatedReviews: this.weeklyAggregatedReviews,
      weeklyAggregatedScore: this.weeklyAggregatedScore,
      aggregatedReviews: this.aggregatedReviews,
      aggregatedScore: this.aggregatedScore,
    };
    console.log(data);
    addDocument(this.collection, data)
      .then((id) => {
        if (id != "") {
          this.businessID = id;
          console.log("Business added successfully");
        } else {
          console.error("Error adding business");
        }
      })
      .catch((error) => {
        console.error("Error adding business: ", error);
      });
      console.log("DONE")
  }
  setBusinessName(businessName: string) {
    this.businessName = businessName;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      businessName: businessName,
    }).then((bool) => {
      if (bool) {
        console.log("Business name updated successfully");
      } else {
        console.error("Error updating business name");
      }
    });
  }
  setweeklyAggregatedScore(weeklyAggregatedScore: number) {
    this.weeklyAggregatedScore = weeklyAggregatedScore;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      weeklyAggregatedScore: weeklyAggregatedScore,
    }).then((bool) => {
      if (bool) {
        console.log("Weekly aggregated score updated successfully");
      } else {
        console.error("Error updating weekly aggregated score");
      }
    });
  }
  setweeklyAggregatedReviews(weeklyAggregatedReviews: number) {
    this.weeklyAggregatedReviews = weeklyAggregatedReviews;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      weeklyAggregatedReviews: weeklyAggregatedReviews,
    }).then((bool) => {
      if (bool) {
        console.log("Weekly aggregated reviews updated successfully");
      } else {
        console.error("Error updating weekly aggregated reviews");
      }
    });
  }
  setAggregatedReviews(aggregatedReviews: number) {
    this.aggregatedReviews = aggregatedReviews;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      aggregatedReviews: aggregatedReviews,
    }).then((bool) => {
      if (bool) {
        console.log("Aggregated reviews updated successfully");
      } else {
        console.error("Error updating aggregated reviews");
      }
    });
  }
  setAggregatedScore(aggregatedScore: number) {
    this.aggregatedScore = aggregatedScore;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      aggregatedScore: aggregatedScore,
    }).then((bool) => {
      if (bool) {
        console.log("Aggregated score updated successfully");
      } else {
        console.error("Error updating aggregated score");
      }
    });
  }
  setBusinessAddress(businessAddress: string) {
    this.businessAddress = businessAddress;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      businessAddress: businessAddress,
    }).then((bool) => {
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
    updateDocument(this.collection, this.businessID, {
      businessLogo: businessLogo,
    }).then((bool) => {
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
    updateDocument(this.collection, this.businessID, {
      cuisineType: cuisineType,
    }).then((bool) => {
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
    updateDocument(this.collection, this.businessID, {
      businessDescription: businessDescription,
    }).then((bool) => {
      if (bool) {
        console.log("Business description updated successfully");
      } else {
        console.error("Error updating business description");
      }
    });
  }
  setBusinessPictures(businessPictures: Array<string>) {
    this.businessPictures = businessPictures;
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      businessPictures: businessPictures,
    }).then((bool) => {
      if (bool) {
        console.log("Business pictures updated successfully");
      } else {
        console.error("Error updating business pictures");
      }
    });
  }
  addBusinessPicture(businessPictures: string) {
    this.businessPictures.push(businessPictures);
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    updateDocument(this.collection, this.businessID, {
      businessPictures: this.businessPictures,
    }).then((bool) => {
      if (bool) {
        console.log("Business pictures updated successfully");
      } else {
        console.error("Error updating business pictures");
      }
    });
  }
  getAllReviews() {
    console.log("Business ID: " + this.businessID);
    if (this.businessID === undefined) {
      console.error("Business ID is undefined");
      return;
    }
    const data: Array<Review> = [];
    const docRef = firestore.collection(this.collection).doc(this.businessID);
    firestore
      .collection("reviews")
      .where("businessID", "==", docRef)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const reviewData = doc.data();
          reviewData.customerID
            .get()
            .then((customerDoc: { data: () => any }) => {
              console.log("XX", customerDoc.data());
            });
          const review = new Review(
            doc.id,
            reviewData.customerID,
            reviewData.businessID,
            reviewData.dateTime.toDate(),
            reviewData.reviewText,
            reviewData.verified,
            reviewData.rating
          );
          data.push(review);
        });
        console.log(data);
      });
    return data;
  }
}
class Customer {
  customerID: string;
  name: string;
  uid: string;
  ProfilePic: string;
}
class Review {
  collection: string = "reviews";
  reviewID: string;
  customerID: string;
  businessID: string;
  dateTime: Date;
  reviewText: string;
  verified: boolean;
  rating: number;
  constructor(
    reviewID: string,
    customerID: string,
    businessID: string,
    dateTime: Date,
    reviewText: string,
    verified: boolean,
    rating: number
  ) {
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
      rating: this.rating,
    };
    addDocument(this.collection, data)
      .then((bool) => {
        if (bool) {
          console.log("Review added successfully");
        } else {
          console.error("Error adding review");
        }
      })
      .catch((error) => {
        console.error("Error adding review: ", error);
      });
  }
}
class Owner {
  ownerID: string;
  name: string;
  uid: string;
}

const uploadImage = async (file: File): Promise<string> => {
  const apiKey = "1a8c9b61971cf5e7191ab4c0f235f7e3";
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("Image upload failed");
  }
};

export { Business, menuItem, Customer, Review, Owner, uploadImage };
export type { businessData };
