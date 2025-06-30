"use client";

import useEmployeeStore from "@/stores/employee-store";
import { DataTable } from "./data-table";
import { useEffect } from "react";
import { columns } from "./columns";

export default function EmployeesTable() {
  const { employees, loadEmployees } = useEmployeeStore();

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return (
    <>
      <DataTable data={employees} columns={columns} />
    </>
  );
}
