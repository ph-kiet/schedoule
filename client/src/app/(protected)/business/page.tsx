"use client";
import PasswordForm from "./password-form";
import BusinessForm from "./business-form";

export default function Page() {
  return (
    <div className="grid sm:grid-cols-2 space-y-4 gap-6">
      <div>
        <div className="text-2xl font-bold">Business</div>
        <BusinessForm />
      </div>
      <div>
        <div className="text-2xl font-bold">Business password</div>
        <PasswordForm />
      </div>
    </div>
  );
}
