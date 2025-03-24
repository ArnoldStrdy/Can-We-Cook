import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { firebaseConfig } from "../FirebaseConfig";
import { Url } from "url";

// Your web app's Firebase configuration

// Initialize Firebase
let auth;
if (!firebase.apps.length) {
  auth = firebase.initializeApp(firebaseConfig);
} else {
  auth = firebase.app(); // if already initialized, use that one
}

// Initialize Firestore and Auth
const firestore = firebase.firestore();

// Function to add a document to a collection
const addDocument = async (
  collectionName: string,
  data: any
): Promise<boolean> => {
  try {
    const docRef = await firestore.collection(collectionName).add(data);
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
};

// Function to get a document from a collection
const getDocument = async (
  collectionName: string,
  docId: string
): Promise<firebase.firestore.DocumentData | undefined> => {
  try {
    const docD = firestore.collection(collectionName).doc(docId);
    const doc = await docD.get();
    console.log("[X] Document data:", doc.data());
    if (doc.exists) {
      console.log("Document data:", doc.data());
      return doc.data();
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
  return undefined;
};

// Function to update a document in a collection
const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any
): Promise<boolean> => {
  try {
    await firestore.collection(collectionName).doc(docId).update(data);
    console.log("Document successfully updated!");
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
};

// Function to delete a document from a collection
const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<boolean> => {
  try {
    await firestore.collection(collectionName).doc(docId).delete();
    console.log("Document successfully deleted!");
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
};

const getCollection = async (
  collectionName: string
): Promise<firebase.firestore.QuerySnapshot | undefined> => {
  try {
    const snapshot = await firestore.collection(collectionName).get();
    snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
      console.log(doc.id, " => ", doc.data());
    });
    return snapshot;
  } catch (error) {
    console.error("Error getting collection: ", error);
    return undefined;
  }
};

const getBusiness = async (docId: string): Promise<Business | undefined> => {
  try {
    console.log("Getting business: ", docId);
    const doc = await getDocument("businesses", docId);
    console.log("Business: ", doc);
    if (doc) {
      return new Business(
        doc.businessName,
        doc.businessCertificate,
        doc.businessDescription,
        doc.businessLogo,
        doc.businessPhotos,
        doc.businessWeeklyRating,
        doc.businessMenu,
        doc.cuisineType,
        doc.businessLocation,
        doc.businessID
      );
    }
  } catch (error) {
    console.error("Error getting business: ", error);
  }
  return undefined;
};

class Business {
  businessName: string;
  businessCertificate: Array<string>;
  businessDescription: string;
  businessLogo: Url;
  businessPhotos: Array<Url>;
  businessWeeklyRating: number;
  businessMenu: Array<string>;
  cuisineType: string;
  businessLocation: Array<number>;
  businessID: string;

  constructor(
    businessMame: string,
    buisnessCertificate: Array<string>,
    buisnessDescription: string,
    buisnessLogo: Url,
    buisnessPhotos: Array<Url>,
    businessWeeklyRating: number,
    businessMenu: Array<string>,
    cuisineType: string,
    businessLocation: Array<number>,
    businessID: string
  ) {
    this.businessID = businessID;
    this.businessName = businessMame;
    this.businessCertificate = buisnessCertificate;
    this.businessDescription = buisnessDescription;
    this.businessLogo = buisnessLogo;
    this.businessPhotos = buisnessPhotos;
    this.businessWeeklyRating = businessWeeklyRating;
    this.businessMenu = businessMenu;
    this.cuisineType = cuisineType;
    this.businessLocation = businessLocation;
  }
  setBusinessID(businessID: string) {
    this.businessID = businessID;
  }
  getBusinessID() {
    return this.businessID;
  }
  setbusinessName(name: string) {
    this.businessName = name;
  }
  getbusinessName() {
    return this.businessName;
  }
  setBuisnessCertificate(buisnessCertificate: Array<string>) {
    this.businessCertificate = buisnessCertificate;
  }
  getBuisnessCertificate() {
    return this.businessCertificate;
  }
  setBuisnessDescription(buisnessDescription: string) {
    this.businessDescription = buisnessDescription;
  }
  getBuisnessDescription() {
    return this.businessDescription;
  }
  setBuisnessLogo(buisnessLogo: Url) {
    this.businessLogo = buisnessLogo;
  }
  getBuisnessLogo() {
    return this.businessLogo;
  }
  setBuisnessPhotos(buisnessPhotos: Array<Url>) {
    this.businessPhotos = buisnessPhotos;
  }
  getBuisnessPhotos() {
    return this.businessPhotos;
  }
  setBusinessWeeklyRating(businessWeeklyRating: number) {
    this.businessWeeklyRating = businessWeeklyRating;
  }
  getBusinessWeeklyRating() {
    return this.businessWeeklyRating;
  }
  setBusinessMenu(businessMenu: Array<string>) {
    this.businessMenu = businessMenu;
  }
  getBusinessMenu() {
    return this.businessMenu;
  }
  setCuisineType(cuisineType: string) {
    this.cuisineType = cuisineType;
  }
  getCuisineType() {
    return this.cuisineType;
  }
  setBusinessLocation(businessLocation: Array<number>) {
    this.businessLocation = businessLocation;
  }
  getBusinessLocation() {
    return this.businessLocation;
  }
}

class Customer {
  customerName: string;
  customerProfilePic: Url | undefined;
  customerID: string;
  constructor(
    customerName: string,
    customerID: string,
    customerProfilePic?: Url
  ) {
    this.customerName = customerName;
    this.customerID = customerID;
    this.customerProfilePic = customerProfilePic;
  }
  setCustomerName(customerName: string) {
    this.customerName = customerName;
  }
  getCustomerName() {
    return this.customerName;
  }
  setCustomerProfilePic(customerProfilePic: Url) {
    this.customerProfilePic = customerProfilePic;
  }
  getCustomerProfilePic() {
    return this.customerProfilePic;
  }
  setCustomerID(customerID: string) {
    this.customerID = customerID;
  }
  getCustomerID() {
    return this.customerID;
  }
}
const createCustomer = async (
  customerName: string,
  customerID: string,
  profilePicUrl: string
) => {
  try {
    const result = await addDocument("customers", {
      name: customerName,
      ProfilePic: profilePicUrl,
      uid: customerID,
    });
    console.log("Customer created successfully: ", result);
    return new Customer(customerName, customerID);
  } catch (error) {
    console.error("Error creating customer: ", error);
    throw error; // So caller knows it failed
  }
};
const getCustomer = async (docId: string): Promise<Customer | undefined> => {
  try {
    console.log("Getting customer: ", docId);
    const doc = await getDocument("customers", docId);
    console.log("Customer: ", doc);
    if (doc) {
      return new Customer(
        doc.customerName,
        doc.customerProfilePic,
        doc.customerID
      );
    }
  } catch (error) {
    console.error("Error getting customer: ", error);
  }
  return undefined;
};
export const getCustomerFromUID = async (
  uid: string
): Promise<{ name: string; profilePic: string } | undefined> => {
  try {
    const snapshot = await firestore
      .collection("customers")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const data = snapshot.docs[0].data();
    return {
      name: data.name as string,
      profilePic: data.ProfilePic as string,
    };
  } catch (error) {
    console.error("Error getting customer data:", error);
    return undefined;
  }
};
class Owner {
  ownerName: string;
  ownerID: string;
  constructor(ownerName: string, ownerID: string) {
    this.ownerName = ownerName;
    this.ownerID = ownerID;
  }
  setOwnerName(ownerName: string) {
    this.ownerName = ownerName;
  }
  getOwnerName() {
    return this.ownerName;
  }
  setOwnerID(ownerID: string) {
    this.ownerID = ownerID;
  }
  getOwnerID() {
    return this.ownerID;
  }
}

const getOwner = async (docId: string): Promise<Owner | undefined> => {
  try {
    console.log("Getting owner: ", docId);
    const doc = await getDocument("owners", docId);
    console.log("Owner: ", doc);
    if (doc) {
      return new Owner(doc.ownerName, doc.ownerID);
    }
  } catch (error) {
    console.error("Error getting owner: ", error);
  }
  return undefined;
};

class Review {
  customerID: string | undefined;
  businessID: string;
  reviewText: string;
  rating: number;
  dateTime: Date;
  reviewID: string;
  verified: boolean;
  constructor(
    customerID: string,
    businessID: string,
    reviewText: string,
    rating: number,
    dateTime: Date,
    reviewID: string,
    verified: boolean
  ) {
    this.customerID = customerID;
    this.businessID = businessID;
    this.reviewText = reviewText;
    this.rating = rating;
    this.dateTime = dateTime;
    this.reviewID = reviewID;
    this.verified = verified;
  }
  setCustomerID(customerID: string) {
    this.customerID = customerID;
  }
  getCustomerID() {
    return this.customerID;
  }
  setBusinessID(businessID: string) {
    this.businessID = businessID;
  }
  getBusinessID() {
    return this.businessID;
  }
  setReviewText(reviewText: string) {
    this.reviewText = reviewText;
  }
  getReviewText() {
    return this.reviewText;
  }
  setRating(rating: number) {
    this.rating = rating;
  }
  getRating() {
    return this.rating;
  }
  setDateTime(dateTime: Date) {
    this.dateTime = dateTime;
  }
  getDateTime() {
    return this.dateTime;
  }
  setReviewID(reviewID: string) {
    this.reviewID = reviewID;
  }
  getReviewID() {
    return this.reviewID;
  }
  setVerified(verified: boolean) {
    this.verified = verified;
  }
  getVerified() {
    return this.verified;
  }
}

const getReview = async (docId: string): Promise<Review | undefined> => {
  try {
    console.log("Getting review: ", docId);
    const doc = await getDocument("reviews", docId);
    console.log("Review: ", doc);
    if (doc) {
      return new Review(
        doc.customerID,
        doc.businessID,
        doc.reviewText,
        doc.rating,
        doc.dateTime,
        doc.reviewID,
        doc.verified
      );
    }
  } catch (error) {
    console.error("Error getting review: ", error);
  }
  return undefined;
};

const reviewFromBusiness = async (
  businessID: string
): Promise<Array<Review>> => {
  try {
    const reviews: Review[] = [];
    const snapshot = await firestore
      .collection("reviews")
      .where("businessID", "==", businessID)
      .get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push(
        new Review(
          data.customerID,
          data.businessID,
          data.reviewText,
          data.rating,
          data.dateTime.toDate ? data.dateTime.toDate() : data.dateTime, // handle Firestore Timestamp
          data.reviewID,
          data.verified
        )
      );
    });

    return reviews;
  } catch (error) {
    console.error("Error getting reviews: ", error);
    return []; // safer fallback than undefined
  }
};

export {
  firestore,
  auth,
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getCollection,
  getBusiness,
  Business,
  createCustomer,
};
