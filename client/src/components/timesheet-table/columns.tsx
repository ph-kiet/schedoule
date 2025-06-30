"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ITimesheet } from "@/types/interfaces";
import { format } from "date-fns";

export const columns: ColumnDef<ITimesheet>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "fullName",
    header: "Employee",
    enableHiding: true,
  },
  {
    accessorKey: "rosterStart",
    header: () => <div className="text-center">Roster Start</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("rosterStart")
            ? format(row.getValue("rosterStart"), "HH:mm")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "rosterEnd",
    header: () => <div className="text-center">Roster End</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("rosterEnd")
            ? format(row.getValue("rosterEnd"), "HH:mm")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "checkInDate",
    header: () => <div className="text-center">Actual Start</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("checkInDate")
            ? format(row.getValue("checkInDate"), "HH:mm")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "checkOutDate",
    header: () => <div className="text-center">Actual End</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("checkOutDate")
            ? format(row.getValue("checkOutDate"), "HH:mm")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "totalHours",
    header: () => <div className="text-center">Total Hours</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("totalHours") ? row.getValue("totalHours") : "0"}
        </div>
      );
    },
  },
];
