import { Timestamp } from "firebase/firestore";

export type TReview = {
  customerName: string;
  dateTime: Timestamp;
  rating: number;
  reviewText: string;
  verified: boolean;
}

export type TMenu = {
  itemId: string;
  itemImage: string;
  itemName: string;
  itemPrice: number;
}

export type TCustomer = {
  name: string
}