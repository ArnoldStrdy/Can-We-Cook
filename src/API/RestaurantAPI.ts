import { db } from "@/FirebaseConfig";
import { TCustomer, TMenu, TReview } from "@/Types/RestaurantTypes";
import { collection, doc, DocumentReference, getDoc, getDocs, query, where } from "firebase/firestore";

export const getReviewByBusinessId = async (businessId: string): Promise<TReview[]> => {
    try {
      // Convert businessId string into a Firestore reference
      const businessRef = doc(db, "businesses", businessId);
  
      // Query reviews where businessId matches
      const reviewsQuery = query(collection(db, "reviews"), where("businessID", "==", businessRef));
      const querySnapshot = await getDocs(reviewsQuery);
  
      // Extract reviews with business & customer references
      const reviewsData: TReview[] = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const customerRef = data.customerID as DocumentReference; // Firestore Reference to customer
          let customerName = "Unknown Customer";
  
          // Fetch Customer Name
          if (customerRef) {
            const customerDoc = await getDoc(customerRef);
            if (customerDoc.exists()) {
              const customerData = customerDoc.data() as TCustomer;
              customerName = customerData.name; // Extract customer name
            }
          }
  
          return {
            customerName: customerName,
            dateTime: data.dateTime,
            rating: data.rating,
            reviewText: data.reviewText,
            verified: data.verified,
          };
        })
      );
  
      return reviewsData
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return []
    }
  }

  export const getMenuByBusinessId = async(businessId: string): Promise<TMenu[]> => {
    try {
      const docRef = doc(db, "businesses", businessId);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        console.log(data.menu)
        return data.menu
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
    return []
  }