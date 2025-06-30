"use client";
import { getUpcomingShifts } from "@/apis/roster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IRoster } from "@/types/interfaces";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

function UpcomingShifts() {
  const [shifts, setShifts] = useState<IRoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getUpcomingShifts();
      setShifts(data.rosters);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Shifts</CardTitle>
        <CardDescription>Quickly view your roster here</CardDescription>
        <CardAction>
          <Button variant="link">
            <Link href="/roster/month-view">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Spinner />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Break Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift._id}>
                  <TableCell>
                    {format(shift.startDate, "EEEE dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{format(shift.startDate, "HH:mm")}</TableCell>
                  <TableCell>{format(shift.endDate, "HH:mm")}</TableCell>
                  <TableCell>{shift.breakTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {shifts.length == 0 && (
              <TableCaption>No upcoming shifts</TableCaption>
            )}
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingShifts;
