"use client";
import { getQRCode } from "@/apis/qr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuthStore from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, MapPin } from "lucide-react";

export default function Home() {
  const { business, checkAuth, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [qrCode, setQRCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch QR code and reset timer
  const fetchQRCode = async () => {
    setIsLoading(true);
    const data = await getQRCode();
    setQRCode(data.qrCode);
    if (!data.new) {
      setTimeLeft(data.ttl);
    } else {
      setTimeLeft(30);
    }
    setIsLoading(false);
  };

  // Initial QR code fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchQRCode();
    }
  }, [isAuthenticated]);

  // Timer countdown
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, isLoading]);

  const handleRefresh = () => {
    fetchQRCode();
  };

  return (
    <>
      {isAuthenticated && (
        <div className="flex items-center justify-center py-4 lg:h-screen">
          <Card className="mx-auto w-96">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Scan this to check in and out
              </CardTitle>
              <CardDescription className="space-y-4 mt-4">
                <div className="flex items-start gap-2">
                  <Building className="mt-1 size-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{business?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Code: {business?.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 size-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {business?.address}
                    </p>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isLoading ? (
                <Loadding />
              ) : (
                <>
                  {timeLeft > 0 ? (
                    <span>QR code expires in {timeLeft} seconds</span>
                  ) : (
                    <span className="text-red-500">QR code has expired</span>
                  )}
                  <img src={qrCode} alt="QRCode" className="mb-4" />
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="mx-auto"
                onClick={handleRefresh}
                disabled={isLoading || timeLeft > 0}
              >
                Refresh QR Code
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

const Loadding = () => {
  return (
    <div className="w-full h-[334px] flex flex-col justify-center ">
      <div className="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin fill-accent-foreground"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading QR Code...</span>
        </div>
      </div>
    </div>
  );
};
