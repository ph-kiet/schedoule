"use client";
import useTimesheetStore from "@/stores/timesheet-store";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect } from "react";
import useAuthStore from "@/stores/auth-store";

export default function TimesheetTable() {
  const { timesheets, dateRange, loadTimesheets } = useTimesheetStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (dateRange) {
      loadTimesheets(user.role, {
        from: dateRange.from,
        to: dateRange.to,
      });
    }
  }, [user, dateRange, loadTimesheets]);

  return <DataTable data={timesheets} columns={columns} />;
}
