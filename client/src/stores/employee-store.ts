import { getEmployees } from "@/apis/employees";
import { IEmployee } from "@/types/interfaces";
import { create, StateCreator } from "zustand";

interface Store {
  employees: IEmployee[];
  selectedEmployee: IEmployee | null;
  setSelectedEmployee: (employee: IEmployee) => void;
  addEmployee: (employee: IEmployee) => void;
  updateEmployee: (employee: IEmployee) => void;
  deleteEmployee: (targetEmployee: IEmployee) => void;
  loadEmployees: () => void;
}

const employeeStore: StateCreator<Store> = (set) => ({
  employees: [],
  selectedEmployee: null,
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  loadEmployees: async () => {
    const fetchedEmployees = await getEmployees();
    set({ employees: fetchedEmployees });
  },
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),
  updateEmployee: (updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      ),
    })),
  deleteEmployee: (targetEmployee) =>
    set((state) => ({
      employees: state.employees.filter(
        (employee) => employee._id !== targetEmployee._id
      ),
    })),
});

const useEmployeeStore = create(employeeStore);

export default useEmployeeStore;
