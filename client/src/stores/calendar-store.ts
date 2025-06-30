import { create, StateCreator } from "zustand";
import { IEvent } from "@/components/calendar/interfaces";
import { IEmployee } from "@/types/interfaces";
import { TCalendarView } from "@/components/calendar/types";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { getRoster } from "@/apis/roster";
import { toast } from "sonner";

interface Store {
  events: IEvent[];
  selectedEvent: IEvent | null;
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: IEmployee["_id"] | "all";
  addEvent: (event: IEvent) => void;
  updateEvent: (updatedEvent: IEvent) => void;
  deleteEvent: (targetEvent: IEvent) => void;
  loadEvents: (view: TCalendarView, date: Date) => Promise<void>;
}

const calendarStore: StateCreator<Store> = (set) => ({
  events: [],
  selectedEvent: null,
  selectedDate: new Date(),
  setSelectedDate: (date) => set(() => ({ selectedDate: date })),
  selectedUserId: "all",
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      ),
    })),

  deleteEvent: (targetEvent) =>
    set((state) => ({
      events: state.events.filter((event) => event._id !== targetEvent._id),
    })),

  loadEvents: async (view: TCalendarView, date: Date) => {
    let startDate: Date;
    let endDate: Date;

    switch (view) {
      case "year":
        startDate = startOfYear(date);
        endDate = endOfYear(date);
        break;
      case "month":
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      case "week":
        startDate = startOfWeek(date, { weekStartsOn: 1 });
        endDate = endOfWeek(date, { weekStartsOn: 1 });
        break;
      case "day":
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      default:
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
    }

    const data = await getRoster(startDate, endDate);

    if (!data.ok) {
      if (data.error.type === "system") {
        toast.error(data.error.message);
      }
      if (data.error.type === "setup") {
        toast.error(data.error.message, {
          action: {
            label: "Set up now",
            onClick: () => {
              window.location.href = "/setup";
            },
          },
          dismissible: false,
        });
      }
      return;
    }
    set({ events: data.rosters });
  },
});

const useCalendarStore = create(calendarStore);

export default useCalendarStore;
