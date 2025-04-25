import { db } from "@/FirebaseConfig";
import { uploadImage } from "@/pages/WrapperObjects";
import {
  TCustomer,
  IExistingMenu,
  INewReview,
  IExistingReview,
  INewMenu,
  TRestaurant,
} from "@/Types/RestaurantTypes";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const getAllBusinesses = async (): Promise<TRestaurant[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "businesses"));
    const documents = querySnapshot.docs.map(
      (doc) =>
        ({
          businessId: doc.id,
          ...doc.data(),
        } as TRestaurant)
    );
    return documents;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBusinessById = async (
  businessID: string
): Promise<TRestaurant | undefined> => {
  try {
    const docRef = doc(db, "businesses", businessID);
    const docSnap = getDoc(docRef);
    return (await docSnap).data() as TRestaurant;
  } catch (error) {
    console.error(error);
  }
};

export const getReviewByBusinessId = async (
  businessId: string
): Promise<IExistingReview[]> => {
    // Convert businessId string into a Firestore reference
    const businessRef = doc(db, "businesses", businessId);

    // Query reviews where businessId matches
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("businessID", "==", businessRef),
      orderBy("dateTime", "desc")
    );

    const querySnapshot = await getDocs(reviewsQuery);

    // Extract reviews with business & customer references
    const reviewsData: IExistingReview[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        let customerName = "Anonymous";
        if (!data.anonymous) {
          const customerRef = data.customerID as DocumentReference; // Firestore Reference to customer
          customerName = "Unknown Customer";
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
          pictures: data.pictures,
        };
      })
    );

    return reviewsData;
};

export const getMenuByBusinessId = async (
  businessId: string
): Promise<IExistingMenu[]> => {
    const docRef = doc(db, "businesses", businessId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.menu;
    } else {
      console.log("No such document!");
      return [];
    }
  
};

export const postReview = async ({
  newReview,
  businessID,
  customerUid,
}: {
  newReview: INewReview;
  businessID: string;
  customerUid: string;
}): Promise<undefined> => {
    const imgUrls = await Promise.all(
      newReview.pictures.map((img) => uploadImage(img))
    );
    const businessRef = doc(db, "businesses", businessID);
    console.log(customerUid)
    if (customerUid) {
      const customerQuery = query(
        collection(db, "customers"),
        where("uid", "==", customerUid)
      );
      const querySnapshot = await getDocs(customerQuery);
      const customerID = querySnapshot.docs[0].id;
      const customerRef = doc(db, "customers", customerID);

      const docRef = await addDoc(collection(db, "reviews"), {
        ...newReview,
        pictures: imgUrls,
        businessID: businessRef,
        customerID: customerRef,
      });
      console.log("Document added with ID: ", docRef);
    } else {
      const docRef = await addDoc(collection(db, "reviews"), {
        ...newReview,
        pictures: imgUrls,
        businessID: businessRef,
      });
        console.log("Document added with ID: ", docRef);
      }
};

export const postNewMenuItem = async ({
  menuItem,
  businessId,
}: {
  menuItem: INewMenu;
  businessId: string;
}): Promise<undefined> => {
    const businessRef = doc(db, "businesses", businessId);
    const itemID = uuidv4();
    if (menuItem.itemImage) {
      const itemImage = await uploadImage(menuItem.itemImage!)
      await updateDoc(businessRef, { menu: arrayUnion({ itemID, ...menuItem, itemImage }) });
    } else {
      await updateDoc(businessRef, { menu: arrayUnion({ itemID, ...menuItem, itemImage:"" }) });
    }
    console.log("Menu item added with ID: ");
};

export const deleteMenuItem = async ({
  itemID,
  businessId,
}: {
  itemID: string;
  businessId: string;
}): Promise<undefined> => {
    const businessRef = doc(db, "businesses", businessId);

    const docSnap = await getDoc(businessRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentArray = data.menu || [];

      // Filter out the item with itemID === 2
      const updatedArray = currentArray.filter(
        (item: IExistingMenu) => item.itemID !== itemID
      );

      await updateDoc(businessRef, {
        menu: updatedArray,
      });
    }
    console.log(`Deleted menu item with id: ${itemID}`);
};
