import { Timestamp } from "firebase/firestore";

export interface TRestaurant {
  aggregatedScore: number;
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

export interface INewReview extends IReview {
  pictures: File[];
}

export interface IExistingReview extends IReview {
  customerName: string;
  pictures: string[];
}

export interface IMenu {
  itemName: string;
  itemPrice: number;
}

export interface INewMenu extends IMenu {
  itemImage?: File;
}

export interface IExistingMenu extends IMenu {
  itemID: string;
  itemImage: string;
}

export type TCustomer = {
  name: string;
};
