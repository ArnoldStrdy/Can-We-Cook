import { Timestamp } from "firebase/firestore";

interface TReview {
  anonymous: boolean
  dateTime: Timestamp;
  rating: number;
  reviewText: string;
  verified: boolean;
}

export interface TNewReview extends TReview{
  pictures: File[]
}

export interface TExistingReview extends TReview {
  customerName: string;
  pictures: string[];
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