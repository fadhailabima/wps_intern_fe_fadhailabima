"use client";
import { login } from "../services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [see, setSee] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      if (res) {
        console.log("ini berhasil login");
        localStorage.setItem("token", res.token);
        localStorage.setItem("nama_role", res.nama_role);

        // Check the role of the user and route accordingly
        if (res.nama_role === "Direktur") {
          router.push("/dashboard-direktur");
        } else if (res.nama_role === "Manager") {
          router.push("/dashboard-manager");
        } else if (res.nama_role === "Staff") {
          router.push("/dashboard-staff");
        }
      } else {
        console.error("Unexpected server response:", res);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message); // Set the error message to the error state
    }
  };
  return (
    <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-200 py-10">
      <div className="flex shadow-md">
        <div
          className="bg-cyan-500 flex flex-wrap content-center justify-center rounded-l-md"
          style={{ width: "24rem", height: "32rem" }}
        >
          <div className="w-72">
            <h1 className="text-xl font-semibold">Selamat Datang</h1>
            <small className="text-white-400">Silahkan Login</small>

            <form className="mt-4">
              <div className="mb-3">
                <label className="mb-2 block text-xs font-semibold">
                  Username
                </label>
                <Input
                  onChange={(e) => setUsername(e.target.value)}
                  type="username"
                  className="text-white"
                  placeholder="Enter your username"
                  style={{ borderColor: "white" }}
                />
              </div>

              <div className="mb-3 relative">
                <label className="mb-2 block text-xs font-semibold">
                  Password
                </label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  type={see ? "text" : "password"}
                  className="text-white pr-10"
                  placeholder="*****"
                  style={{ borderColor: "white" }}
                />
                <button
                  type="button"
                  className="absolute top-7 right-2 bg-transparent border-none text-2xl text-gray-300 flex justify-center items-center ml-2 cursor-pointer"
                  onClick={() => setSee(!see)}
                >
                  <FaEye />
                </button>
              </div>
              <div className="mb-3">
                <Button onClick={handleLogin}>Login</Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </div>
        </div>

        <div
          className="flex flex-wrap content-center justify-center rounded-r-md"
          style={{ width: "27rem", height: "32rem" }}
        >
          <img
            className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md"
            src="logo-wps.png"
            alt="Login Banner"
          />
        </div>
      </div>
    </div>
  );
}
