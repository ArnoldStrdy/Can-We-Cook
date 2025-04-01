import { Timestamp } from "firebase/firestore";

export type TReview = {
  customerName: string;
  dateTime: Timestamp;
  rating: number;
  reviewText: string;
  verified: boolean;
}

export type TCustomer = {
  name: string
}