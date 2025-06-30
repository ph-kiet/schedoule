"use client";
import { checkIn } from "@/apis/attendance";
import CheckOutDialog from "@/components/attendance/check-out-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDisclosure } from "@/hooks/use-disclosure";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"; // Import useRef

import { toast } from "sonner";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const { isOpen, onToggle } = useDisclosure();
  const hasCheckedIn = useRef(false); // Create a ref to track check-in
  const [text, setText] = useState("");

  useEffect(() => {
    if (!hasCheckedIn.current) {
      // Only run if not already called
      hasCheckedIn.current = true; // Set to true to prevent future calls
      handleCheckIn();
    }
  }, []); // Empty dependency array ensures useEffect runs once on mount

  if (!token || token === "") {
    router.replace("/not-found");
    return;
  }

  const handleCheckIn = async () => {
    const data = await checkIn(token);

    setIsLoading(false);
    if (!data.ok) {
      setText(data.error.message);
      toast.error(data.error.message, { position: "bottom-center" });
      return;
    }

    if (data.checkedIn) {
      onToggle();
      return;
    }

    setText(data.message);
    toast.success(data.message, { position: "bottom-center" });
  };

  return (
    <>
      {isLoading ? (
        <Spinner size="medium" />
      ) : (
        <div className="text-center flex flex-col gap-10">
          <span className="text-2xl font-medium">{text}</span>
          <div>
            <Button>
              <Link href="/timesheet">Check your timesheet</Link>
            </Button>
          </div>
        </div>
      )}
      <CheckOutDialog
        isOpen={isOpen}
        onToggle={onToggle}
        token={token}
        setText={setText}
      />
    </>
  );
}
