"use client";
import { getAttendanceLogs } from "@/apis/attendance";
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
import { ILog } from "@/types/interfaces";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

function AttendanceLogs() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<ILog[]>([]);
  useEffect(() => {
    (async () => {
      const data = await getAttendanceLogs();
      setLogs(data.logs ? data.logs : []);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Logs</CardTitle>
        <CardDescription>View today check in / out logs</CardDescription>
        <CardAction>
          <Button variant="link">
            <Link href="/timesheet">View all</Link>
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
                <TableHead>Employee</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell>{log.fullName}</TableCell>
                  <TableCell>{log.event}</TableCell>
                  <TableCell>{format(log.time, "HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {logs.length == 0 && (
              <TableCaption>No data for today yet.</TableCaption>
            )}
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AttendanceLogs;
