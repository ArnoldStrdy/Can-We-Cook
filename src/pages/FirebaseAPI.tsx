import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { firebaseConfig } from '../FirebaseConfig';
import { Url } from 'url';

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
const addDocument = async (collectionName: string, data: any): Promise<boolean> => {
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
const getDocument = async (collectionName: string, docId: string): Promise<firebase.firestore.DocumentData | undefined> => {
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
const updateDocument = async (collectionName: string, docId: string, data: any): Promise<boolean> => {
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
const deleteDocument = async (collectionName: string, docId: string): Promise<boolean> => {
    try {
        await firestore.collection(collectionName).doc(docId).delete();
        console.log("Document successfully deleted!");
        return true;
    } catch (error) {
        console.error("Error deleting document: ", error);
        return false;
    }
};

const getCollection = async (collectionName: string): Promise<firebase.firestore.QuerySnapshot | undefined> => {
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


const getBusiness = async (docId: string): Promise<Business | undefined> => {
    try {
        console.log("Getting business: ", docId);
        const doc = await getDocument("businesses", docId);
        console.log("Business: ", doc);
        if (doc) {
            return new Business(doc.businessName, doc.businessCertificate, doc.businessDescription, 
                                doc.businessLogo, doc.businessPhotos, doc.businessWeeklyRating, 
                                doc.businessMenu, doc.cuisineType, doc.businessLocation);
        }
    } catch (error) {
        console.error("Error getting business: ", error);
    }
    return undefined;
}


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

    constructor(businessMame: string, buisnessCertificate: Array<string>, 
        buisnessDescription: string, buisnessLogo: Url, buisnessPhotos: Array<Url>, 
        businessWeeklyRating: number, businessMenu: Array<string>, cuisineType: string, businessLocation: Array<number>) {
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
    
}

export { firestore, auth, addDocument, getDocument, updateDocument, deleteDocument, getCollection, getBusiness, Business };