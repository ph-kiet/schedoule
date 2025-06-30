import { Button } from "@/components/ui/button";
import { TCalendarView } from "../types";
import DateNavigator from "./date-navigator";
import { TodayButton } from "./today-button";
import Link from "next/link";
import { Columns, Grid2x2, Grid3x3, List, Plus } from "lucide-react";
import AddEventDialog from "../components/dialogs/add-event-dialog";
import useAuthStore from "@/stores/auth-store";

interface IProps {
  view: TCalendarView;
}

export default function CalendarHeader({ view }: IProps) {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} />
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex w-full items-center gap-1.5">
          <div className="inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none">
            <Button
              asChild
              aria-label="View by day"
              size="icon"
              variant={view === "day" ? "default" : "outline"}
              className="rounded-r-none [&_svg]:size-5"
            >
              <Link href="/roster/day-view">
                <List strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label="View by week"
              size="icon"
              variant={view === "week" ? "default" : "outline"}
              className="-ml-px rounded-none [&_svg]:size-5"
            >
              <Link href="/roster/week-view">
                <Columns strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label="View by month"
              size="icon"
              variant={view === "month" ? "default" : "outline"}
              className="-ml-px rounded-none [&_svg]:size-5"
            >
              <Link href="/roster/month-view">
                <Grid2x2 strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label="View by year"
              size="icon"
              variant={view === "year" ? "default" : "outline"}
              className="-ml-px rounded-l-none [&_svg]:size-5"
            >
              <Link href="/roster/year-view">
                <Grid3x3 strokeWidth={1.8} />
              </Link>
            </Button>

            {/* <Button
              asChild
              aria-label="View by agenda"
              size="icon"
              variant={view === "agenda" ? "default" : "outline"}
              className="-ml-px rounded-l-none [&_svg]:size-5"
            >
              <Link href="/roster/agenda-view">
                <CalendarRange strokeWidth={1.8} />
              </Link>
            </Button> */}
          </div>
        </div>
        {user?.role === "user" && (
          <AddEventDialog>
            <Button className="w-full sm:w-auto">
              <Plus />
              Assign Employee
            </Button>
          </AddEventDialog>
        )}
      </div>
    </div>
  );
}
