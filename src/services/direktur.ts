import axios from "axios";

export type ManagerDailyLog = {
  id: number;
  activity: string;
  date: string;
  status: string;
  image_url: string;
  nama_user: string;
  nama_divisi: string;
};

export const getDailyLogManager = async (token: string): Promise<ManagerDailyLog[]> => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/direktur/dailylog",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Terjadi kesalahan dalam mendapatkan data admin`);
  }
};
