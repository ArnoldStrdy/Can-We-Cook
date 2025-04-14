import { db } from "@/FirebaseConfig";
import { TCustomer, TMenu, TNewReview, TReview } from "@/Types/RestaurantTypes";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const getReviewByBusinessId = async (
  businessId: string
): Promise<TReview[]> => {
  try {
    // Convert businessId string into a Firestore reference
    const businessRef = doc(db, "businesses", businessId);

    // Query reviews where businessId matches
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("businessID", "==", businessRef)
    );
    const querySnapshot = await getDocs(reviewsQuery);

    // Extract reviews with business & customer references
    const reviewsData: TReview[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        let customerName = "Anonymous";
        if (!data.anonymous) {
          const customerRef = data.customerID as DocumentReference; // Firestore Reference to customer
          customerName = "Unknow Customer"
          // Fetch Customer Name
          if (customerRef) {
            const customerDoc = await getDoc(customerRef);
            if (customerDoc.exists()) {
              const customerData = customerDoc.data() as TCustomer;
              customerName = customerData.name; // Extract customer name
            }
          }
        }

        return {
          anonymous: data.anonymous,
          customerName: customerName,
          dateTime: data.dateTime,
          rating: data.rating,
          reviewText: data.reviewText,
          verified: data.verified,
        };
      })
    );

    return reviewsData;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const getMenuByBusinessId = async (
  businessId: string
): Promise<TMenu[]> => {
  try {
    const docRef = doc(db, "businesses", businessId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.menu;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
  return [];
};

export const postReview = async ({
  newReview,
  businessID,
  customerUid,
}: {
  newReview: TNewReview;
  businessID: string;
  customerUid: string;
}): Promise<undefined> => {
  try {
    const customerQuery = query(
      collection(db, "customers"),
      where("uid", "==", customerUid)
    );
    const querySnapshot = await getDocs(customerQuery);
    const customerID = querySnapshot.docs[0].id;
    const businessRef = doc(db, "businesses", businessID);
    const customerRef = doc(db, "customers", customerID);
    const docRef = await addDoc(collection(db, "reviews"), {
      ...newReview,
      businessID: businessRef,
      customerID: customerRef,
    });
    console.log("Document added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
