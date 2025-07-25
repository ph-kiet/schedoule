import useCalendarStore from "@/stores/calendar-store";
import { useMemo } from "react";
import { calculateMonthEventPositions, getCalendarCells } from "../../helpers";
import DayCell from "./day-cell";
import { IEvent } from "../../interfaces";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarMonthView({
  singleDayEvents,
  multiDayEvents,
}: IProps) {
  const { selectedDate } = useCalendarStore();

  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate
      ),
    [multiDayEvents, singleDayEvents, selectedDate]
  );

  return (
    <div>
      <div className="grid grid-cols-7 divide-x">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x overflow-hidden">
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </div>
  );
}
