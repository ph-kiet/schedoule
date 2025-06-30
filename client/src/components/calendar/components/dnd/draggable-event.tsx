import React, { useRef } from "react";
import { IEvent } from "../../interfaces";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/auth-store";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export const ItemTypes = {
  EVENT: "event",
};

export function DraggableEvent({ event, children }: IProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: { event },
    canDrag: user?.role === "user",
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  drag(ref);

  return (
    <div ref={ref} className={cn(isDragging && "opacity-40")}>
      {children}
    </div>
  );
}
