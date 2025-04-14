import { Timestamp } from "firebase/firestore";

export interface TNewReview {
  anonymous: boolean
  dateTime: Timestamp;
  rating: number;
  reviewText: string;
  verified: boolean;
}

export interface TReview extends TNewReview {
  customerName: string;
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