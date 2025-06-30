"use client";
import useAuthStore from "@/stores/auth-store";
import UserForm from "./user-form";
import EmployeeForm from "./employee-form";
import { PasswordForm } from "./password-form";

export default function Page() {
  const { user } = useAuthStore();
  return (
    <div className="grid sm:grid-cols-2 space-y-4 gap-6">
      <div>
        <div className="text-2xl font-bold">Profile</div>
        {user?.role === "user" ? <UserForm /> : <EmployeeForm />}
      </div>
      <div>
        <div className="text-2xl font-bold">Change password</div>
        <PasswordForm />
      </div>
    </div>
  );
}
