import { Timestamp } from "firebase/firestore";

export interface TRestaurant {
  businessId: string;
  businessAddress: string;
  businessCertifications: string[];
  businessDescription: string;
  businessLocation: number[];
  businessLogo: string;
  businessName: string;
  businessPictures: string[];
  cuisineType: string;
  menu: IExistingMenu[];
  ownerId: string;
  weeklyAggregateReviews: number;
  weeklyAggregateScore: number;
}

interface IReview {
  anonymous: boolean;
  dateTime: Timestamp;
  rating: number;
  reviewText: string;
  verified: boolean;
}

export interface INewReview extends IReview{
  pictures: File[]
}

export interface IExistingReview extends IReview {
  customerName: string;
  pictures: string[];
}

export interface IMenu {
  itemImage: string;
  itemName: string;
  itemPrice: number;
}

export interface IExistingMenu extends IMenu {
  itemID: string;
}

export type TCustomer = {
  name: string
}