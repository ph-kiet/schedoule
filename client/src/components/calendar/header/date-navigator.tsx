import useCalendarStore from "@/stores/calendar-store";
import { TCalendarView } from "../types";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navigateDate, rangeText } from "../helpers";

interface IProps {
  view: TCalendarView;
}

export default function DateNavigator({ view }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendarStore();

  const month = formatDate(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-sm text-muted-foreground">
          {rangeText(view, selectedDate)}
        </p>

        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
