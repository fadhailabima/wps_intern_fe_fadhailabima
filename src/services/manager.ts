import axios from "axios";

export type StaffDailyLog = {
  id: number;
  activity: string;
  date: string;
  status: string;
  image_url: string;
  nama_user: string;
};

export const getDailyLogStaff = async (
  token: string
): Promise<StaffDailyLog[]> => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/manager/dailylog",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Terjadi kesalahan dalam mendapatkan data daily log`);
  }
};
