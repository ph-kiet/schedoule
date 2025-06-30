import { getTimesheet } from "@/apis/timesheet";
import { ITimesheet } from "@/types/interfaces";
import { endOfWeek, startOfWeek } from "date-fns";
import { toast } from "sonner";
import { create, StateCreator } from "zustand";

type TDateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface Store {
  timesheets: ITimesheet[];
  dateRange: TDateRange;
  loadTimesheets: (role: string, { from, to }: TDateRange) => void;
  setDateRange: (dateRange: TDateRange | undefined) => void;
  isLoading: boolean;
}

const timesheetStore: StateCreator<Store> = (set) => ({
  timesheets: [],
  isLoading: true,
  dateRange: {
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  setDateRange: (selectedDateRange) => {
    set({ dateRange: selectedDateRange });
  },
  loadTimesheets: async (role, { from, to }) => {
    if (!from || !to) {
      return;
    }
    set({ isLoading: true });

    const data = await getTimesheet(role, from, to);
    if (!data.ok) {
      if (data.error.type === "setup") {
        toast.error(data.error.message, {
          action: {
            label: "Set up now",
            onClick: () => {
              window.location.href = "/setup";
            },
          },
        });
      }
    }
    set({ timesheets: data.timesheets ? data.timesheets : [] });
    set({ isLoading: false });
  },
});

const useTimesheetStore = create(timesheetStore);

export default useTimesheetStore;
