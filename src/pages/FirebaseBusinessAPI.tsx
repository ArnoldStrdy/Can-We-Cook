import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../FirebaseConfig';
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
        const doc = await firestore.collection(collectionName).doc(docId).get();
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
        snapshot.forEach((doc) => {
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
        const doc = await getDocument("businesses", docId);
        if (doc) {
            return new Business(doc.name, doc.buisnessCertificate, doc.buisnessDescription, doc.buisnessLogo, doc.buisnessPhotos, doc.businessWeeklyRating, doc.businessMenu, doc.cuisineType);
        }
    } catch (error) {
        console.error("Error getting business: ", error);
    }
    return undefined;
}

class Business {
    name: string;
    buisnessCertificate: Array<string>;
    buisnessDescription: string;
    buisnessLogo: Url;
    buisnessPhotos: Array<Url>;
    businessWeeklyRating: number;
    businessMenu: Array<string>;
    cuisineType: string;

    constructor(name: string, buisnessCertificate: Array<string>, 
        buisnessDescription: string, buisnessLogo: Url, buisnessPhotos: Array<Url>, 
        businessWeeklyRating: number, businessMenu: Array<string>, cuisineType: string) {
        this.name = name;
        this.buisnessCertificate = buisnessCertificate;
        this.buisnessDescription = buisnessDescription;
        this.buisnessLogo = buisnessLogo;
        this.buisnessPhotos = buisnessPhotos;
        this.businessWeeklyRating = businessWeeklyRating;
        this.businessMenu = businessMenu;
        this.cuisineType = cuisineType;
    }
}

export { firestore, auth, addDocument, getDocument, updateDocument, deleteDocument, getCollection };