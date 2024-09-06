"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDailyLogStaff, StaffDailyLog } from "@/services/manager";
import { changeStatusLog } from "@/services/dailyLog";
import { getUser, User } from "@/services/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function verifLogManager() {
  const router = useRouter();
  const [data, setData] = useState<StaffDailyLog[] | null>(null);
  const [error, setError] = useState(false);

  const getData = async (token: string) => {
    const res = await getDailyLogStaff(token);
    setData(res);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getData(token);
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

  const handleChangeStatus = async (id: number) => {
    const currentItem = data?.find((item) => item.id === id);
    let newStatus = "";

    if (currentItem) {
      if (
        currentItem.status === "Pending" ||
        currentItem.status === "Decline"
      ) {
        newStatus = "Accept";
      } else if (currentItem.status === "Accept") {
        newStatus = "Decline";
      }

      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await changeStatusLog(token, id, newStatus);
          if (res !== undefined) {
            getData(token);
          }
        }
      } catch (error) {
        console.log(error);
      }

      setTimeout(() => {
        getData(localStorage.getItem("token")!);
      }, 100);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const filteredItems = data
    ?.filter(
      (item) =>
        item.nama_user.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterTerm === "" || item.status === filterTerm)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil((filteredItems?.length ?? 0) / itemsPerPage);
  const currentItems = filteredItems?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="flex-1 max-h-full p-5">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <h2 className="text-gray-500 mt-6 text-xl text-center font-semibold pb-1">
          Verifikasi Daily Log Staff - {user?.nama_divisi}
        </h2>
        <div className="flex flex-col space-y-1">
          <Input
            id="search"
            className="mt-2 p-2 rounded"
            style={{ width: "500px", color: "black" }}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div className="flex flex-col space-y-1">
          <select
            id="filter"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none text-xs font-medium tracking-wider  text-gray-500 uppercase p-2"
            style={{ width: "250px", height: "40px" }}
          >
            <option value="" disabled selected>
              Filter by Status
            </option>
            <option value="">All</option>
            <option value="Accept">Accept</option>
            <option value="Decline">Decline</option>
            <option value="Pending">Pending</option>
          </select>
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
                      <td className="text-center py-6 text-sm text-gray-500 whitespace-nowrap flex items-center justify-center">
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
                        <Button
                          onClick={() => handleChangeStatus(log.id)}
                          className={
                            log.status === "Accept"
                              ? "bg-green-600"
                              : log.status === "Pending"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }
                        >
                          {log.status}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-2">
                <Button
                  className="m-2"
                  onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
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
    </div>
  );
}
