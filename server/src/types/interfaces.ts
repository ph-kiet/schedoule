import { Types } from "mongoose";

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatarUrl?: string;
  salt: string;
}

export interface IEmployee {
  employeeId: bigint;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  avatarUrl?: string;
  phoneNumber: string;
  position: string;
  salt: string;
  userId: Types.ObjectId;
  business: Types.ObjectId;
}

export interface IBusiness {
  code: string;
  name: string;
  password: string;
  salt: string;
  owner: Types.ObjectId;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface IRoster {
  employee: Types.ObjectId | IEmployee;
  business: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  breakTime: number;
  description?: string;
}

export interface IAttendance {
  employee: Types.ObjectId | IEmployee;
  business: Types.ObjectId;
  checkInDate: Date;
  checkOutDate?: Date;
  totalHours?: number;
}
