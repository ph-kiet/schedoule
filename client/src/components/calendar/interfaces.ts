import { IEmployee } from "@/types/interfaces";

export interface IEvent {
  _id: string;
  employee: IEmployee;
  startDate: string;
  endDate: string;
  breakTime: number;
  description: string | undefined;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
