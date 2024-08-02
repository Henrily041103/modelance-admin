import { Account } from "./general";

type IndustryType = {
  id: string;
  industryName: string;
};

type LocationType = {
  province: string;
  district: string;
  ward: string;
  address: string;
};

type PortfolioItemType = {
  id: string;
  images: string[];
  title: string;
};

type CompCardItemType = {
  url: string;
  id: string;
};

type SocialMediaItemType = {
  name: string;
  url: string;
};

export type Model = Account & {
  industry: IndustryType;
  location: LocationType;
  portfolio: PortfolioItemType[];
  compCard: CompCardItemType[];
  socialMedia: SocialMediaItemType[];
  category: string[];
  description: string;
  rating: number;
  hourlyRate: number;
  bust: number;
  hip: number;
  waist: number;
  weight: number;
  height: number;
  hairColor: string;
  eyeColor: string;
};

export type Employer = Account & {
  companyName: string;
  description: string;
  industry: IndustryType;
  location: LocationType;
};
