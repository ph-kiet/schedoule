"use client";

import AttendanceLogs from "./attendance-logs";
import UpcomingShifts from "./upcoming-shifts";
import useAuthStore from "@/stores/auth-store";

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="gap-4 space-y-4 grid lg:grid-cols-2 lg:space-y-0">
      {user?.role === "employee" && <UpcomingShifts />}
      {user?.role === "user" && <AttendanceLogs />}
    </div>
  );
}
