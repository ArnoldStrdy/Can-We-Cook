import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { firebaseConfig } from "../FirebaseConfig";

// Your web app's Firebase configuration

// Initialize Firebase
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app(); // if already initialized, use that one
}

// Initialize Firestore and Auth

const firestore = firebase.firestore();

async function addDocument(collectionName: string, data: any): Promise<string> {
  try {
    const docRef = await firestore.collection(collectionName).add(data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id.toString();
  } catch (error) {
    console.error("Error adding document: ", error);
    return "";
  }
}
interface DocumentData {
  id: string;
  data: firebase.firestore.DocumentData;
}
async function getDocument(
  collectionName: string,
  docId: string
): Promise<DocumentData | undefined> {
  try {
    const doc = await firestore.collection(collectionName).doc(docId).get();
    console.log("Document data:", doc.data());
    if (doc.exists) {
      console.log("Document data:", doc.data());
      return { id: doc.id, data: doc.data() } as DocumentData;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
  return undefined;
}

async function updateDocument(
  collectionName: string,
  docId: string,
  data: any
): Promise<boolean> {
  try {
    await firestore.collection(collectionName).doc(docId).update(data);
    console.log("Document successfully updated!");
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
}

async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<boolean> {
  try {
    await firestore.collection(collectionName).doc(docId).delete();
    console.log("Document successfully deleted!");
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
}

async function getCollection(
  collectionName: string
): Promise<firebase.firestore.QuerySnapshot | undefined> {
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
}

const getOwnerFromUID = async (uid: string): Promise<string | undefined> => {
  try {
    const snapshot = await firestore
      .collection("owners")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const data = snapshot.docs[0].data();
    return snapshot.docs[0].id;
  } catch (error) {
    console.error("Error getting owner data:", error);
    return undefined;
  }
};

export const getCustomerFromUID = async (
  uid: string
): Promise<{ name: string; profilePic: string; id: string } | undefined> => {
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
      id: snapshot.docs[0].id,
    };
  } catch (error) {
    console.error("Error getting customer data:", error);
    return undefined;
  }
};

const addRestaurantName = async (businessID: string, name: string) => {
  try {
    await firestore.collection("businesses").doc(businessID).update({
      businessName: name,
    });
    console.log("Restaurant name successfully updated!");
  } catch (error) {
    console.error("Error updating restaurant name: ", error);
  }
};
const getRestuarantfromOwnerID = async (
  ownerID: string
): Promise<string | undefined> => {
  try {
    const snapshot = await firestore
      .collection("businesses")
      .where("ownerID", "==", ownerID)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const data = snapshot.docs[0].data();
    return snapshot.docs[0].id;
  } catch (error) {
    console.error("Error getting restaurant data:", error);
    return undefined;
  }
}
const createCustomer = async (
  name: string,
  uid: string,
  profilePic: string
) => {
  try {
    await firestore.collection("customers").doc().set({
      name: name,
      uid: uid,
      ProfilePic: profilePic,
    });
    console.log("Customer successfully created!");
  } catch (error) {
    console.error("Error creating customer: ", error);
  }
};

const createOwner = async (
  name: string,
  uid: string,
  profilePic: string
) => {
  try {
    await firestore.collection("owners").doc().set({
      name: name,
      uid: uid,
      ProfilePic: profilePic,
    });
    console.log("Owners successfully created!");
  } catch (error) {
    console.error("Error creating owner: ", error);
  }
};

export {
  firestore,
  app,
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getCollection,
  getOwnerFromUID,
  addRestaurantName,
  createCustomer,
  createOwner, 
  getRestuarantfromOwnerID,
};
export type { DocumentData };
