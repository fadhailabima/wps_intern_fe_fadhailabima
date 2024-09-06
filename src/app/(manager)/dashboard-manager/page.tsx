"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDailyLogStaff, StaffDailyLog } from "@/services/manager";
import { getUser, User } from "@/services/user";
import { Button } from "@/components/ui/button";
import { addDays, format, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Dashboard({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const getUserData = async (token: string) => {
    const res = await getUser(token);
    setUser(res);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getUserData(token);
    }
  }, []);

  const [dailyLog, setDailyLog] = useState<StaffDailyLog[] | null>(null);

  const getDailyLog = async (token: string) => {
    const res = await getDailyLogStaff(token);
    setDailyLog(res);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getDailyLog(token);
    }
  }, []);

  const handleViewDescription = (activity: any) => {
    if (typeof activity === "string") {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(activity);
        newWindow.document.close();
      } else {
        alert("Please allow pop-ups for this website");
      }
    } else {
      alert("No activity description available");
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const filteredItems = dailyLog
    ?.filter((item) => {
      const itemDate = new Date(item.date);
      if (isNaN(itemDate.getTime())) {
        return false;
      }
      if (
        date &&
        date.from &&
        date.to &&
        (itemDate < date.from || itemDate > date.to)
      ) {
        return false;
      }

      return (
        item.status !== "Pending" &&
        item.nama_user.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterTerm === "" || item.status === filterTerm)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPages = Math.ceil((filteredItems?.length ?? 0) / itemsPerPage);
  const currentItems = filteredItems?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="flex-1 max-h-full p-5">
      <div className="flex flex-col items-start justify-between pb-6 space-y-4 border-b border-black lg:items-center lg:space-y-0 lg:flex-row">
        <h1 className="text-2xl font-semibold whitespace-nowrap text-black">
          Selamat Datang {user?.nama}
        </h1>
      </div>
      <h3 className="mt-6 text-xl text-gray-500">
        Monitoring Daily Log Staff - {user?.nama_divisi}
      </h3>
      <div className="flex justify-between items-center">
        <Input
          className="mt-2"
          style={{ width: "500px", color: "black" }}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <select
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="border border-gray-300 rounded-lg shadow-sm focus:outline-none text-xs font-medium tracking-wider  text-gray-500 uppercase"
          style={{ width: "250px", height: "40px" }}
        >
          <option value="" disabled selected>
            Filter by Status
          </option>
          <option value="">All</option>
          <option value="Accept">Accept</option>
          <option value="Decline">Decline</option>
        </select>
        <div className={cn("grid gap-2", className)}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal text-black",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
              <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="text-center py-3 text-xs font-medium tracking-wider  text-gray-500 uppercase"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      Nama Karyawan
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 text-xs font-medium tracking-wider  text-gray-500 uppercase"
                    >
                      Tanggal Log
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      Detail Log
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      Bukti Log
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems?.map((log, i) => (
                    <tr
                      key={i}
                      className="transition-all hover:bg-gray-100 hover:shadow-lg"
                    >
                      <td className="text-center py-4 text-sm text-gray-500 whitespace-nowrap">
                        {i + 1}
                      </td>
                      <td className="text-center py-4 text-sm text-gray-500 whitespace-nowrap">
                        {log.nama_user}
                      </td>
                      <td className="text-center py-4 text-sm text-gray-500 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="text-center py-4 text-sm text-gray-500 whitespace-nowrap">
                        <button
                          className="view-description-button border-none border-b border-black text-blue-500 bg-none cursor-pointer"
                          onClick={() => handleViewDescription(log.activity)}
                        >
                          Lihat Detail Log
                        </button>
                      </td>
                      <td className="text-center py-4 text-sm text-gray-500 whitespace-nowrap flex items-center justify-center">
                        {log.image_url ? (
                          <a
                            href={log.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={log.image_url}
                              alt="Cover"
                              className="w-12 h-12"
                            />
                          </a>
                        ) : (
                          "Tidak ada bukti pekerjaan"
                        )}
                      </td>
                      <td className="text-center py-4 text-sm text-gray-500 whitespace-nowrap">
                        {log.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-2">
                <Button
                  className="m-2"
                  onClick={() =>
                    setCurrentPage((old) => Math.max(old - 1, 1, totalPages))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  className="m-2"
                  onClick={() =>
                    setCurrentPage((old) => Math.min(old + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
