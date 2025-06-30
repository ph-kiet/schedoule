export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avataUrl?: string;
}

export interface IEmployee {
  _id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  avatarUrl?: string;
  phoneNumber: string;
  position: string;
  userId: string | IUser;
  businessId: string;
}

export interface ITimesheet {
  _id: string;
  date: string;
  fullName: string;
  rosterStart?: Date;
  rosterEnd?: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  totalHours?: number;
}
export interface IRoster {
  _id: string;
  employee: IEmployee;
  startDate: string;
  endDate: string;
  breakTime: number;
  description: string | undefined;
}

export interface ILog {
  fullName: string;
  event: string;
  time: Date;
}
