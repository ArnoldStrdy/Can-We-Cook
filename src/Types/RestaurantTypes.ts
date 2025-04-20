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

export interface TMenu {
  itemImage: string;
  itemName: string;
  itemPrice: number;
}

export interface TExistingMenu extends TMenu {
  itemID: string;
}

export type TCustomer = {
  name: string
}