"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState, useEffect } from "react";
import { addDailylog } from "@/services/dailyLog";
import "quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

export default function addLogManager() {
  const [activity, setActivity] = useState(""); // assuming it's a number
  const [date, setTanggal] = useState<Date | null>();
  const [error, setError] = useState(null);
  const router = useRouter();
  const [foto, setFoto] = useState<File>();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const Spinner = () => <div>Loading...</div>;
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddLog = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await addDailylog(
        token,
        activity,
        format(date as Date, "yyyy-MM-dd"),
        foto ?? null
      );
      console.log("response", response);
      if (response && response.message === "Daily log added successfully") {
        setShowSuccessAlert(true);
        setTimeout(() => {
          router.push("/dailylog-manager");
        }, 1500);
      } else {
        throw new Error(
          `Failed to add daily log, server responded with status code ${response.status}`
        );
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoto(e.target.files?.[0]);
  };
  return (
    <div className="h-250 py-2 flex justify-center items-center">
      <div className="lg:w-2/5 md:w-1/2 w-2/3">
        <form
          className="bg-white p-10 rounded-lg shadow-lg min-w-full"
          encType="multipart/form-data"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-gray-500 mt-2 text-xl text-center font-semibold pb-1">
              Tambah Daily Log
            </h2>
            <div>
              <Link href="/dailylog-manager">
                <Button className="mt-6">Back</Button>
              </Link>
            </div>
          </div>
          <div>
            <label className="text-gray-800 font-semibold block my-3 text-md">
              Tanggal Daily Log
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal text-black",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pilih Tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date as Date}
                  onSelect={setTanggal}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-gray-800 font-semibold block my-3 text-md">
              Detail Daily Log
            </label>
            <QuillNoSSRWrapper
              value={activity}
              onChange={setActivity}
              placeholder="Masukkan Detail Daily Log"
              theme="snow"
              className="p-2 border-gray-300 border rounded-md w-full transition-colors duration-300 hover:border-primary text-black"
            />
          </div>
          <div>
            <label className="text-gray-800 font-semibold block my-3 text-md">
              Foto Daily Log (opsional)
            </label>
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              className="p-2 border-gray-300 border rounded-md w-full transition-colors duration-300 hover:border-primary text-black"
              onChange={handleFileChange}
            />
          </div>
          <Button
            className="w-full mt-6 mb-3 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
            onClick={handleAddLog}
            disabled={!date || !activity}
          >
            {isLoading ? <Spinner /> : "Submit"}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <button onClick={() => setError(null)}>Close</button>
            </Alert>
          )}
          {showSuccessAlert && (
            <Alert variant="default" style={{ color: "black" }}>
              <AlertCircle className="h-4 w-4" style={{ color: "black" }} />
              <AlertTitle style={{ color: "black" }}>Success</AlertTitle>
              <AlertDescription style={{ color: "black" }}>
                Daily Log has been successfully added
              </AlertDescription>
              <button
                onClick={() => setShowSuccessAlert(false)}
                style={{ color: "black" }}
              >
                Close
              </button>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
