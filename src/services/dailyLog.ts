import axios from "axios";

export const changeStatusLog = async (
  token: string,
  id: number,
  status: string
) => {
  try {
    console.log("status", status);
    const response = await axios.put(
      `http://localhost:8000/api/dailylog/${id}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export type UserDailyLog = {
  id: number;
  activity: string;
  date: string;
  status: string;
  image_url: string;
};

export const getDailyLogUser = async (
  token: string
): Promise<UserDailyLog[]> => {
  try {
    const response = await axios.get("http://localhost:8000/api/dailylog", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Terjadi kesalahan dalam mendapatkan data daily log`);
  }
};

export const addDailylog = async (
  token: string,
  activity: string,
  date: string,
  foto: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("activity", activity);
    formData.append("date", date);

    if (foto) {
      formData.append("foto", foto);
    }

    const response = await axios.post(
      "http://localhost:8000/api/dailylog",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof Error) {
      console.error("Error creating daily log:", error.message);
      throw new Error(
        `Terjadi kesalahan dalam menambah daily log: ${error.message}`
      );
    } else {
      // Handle the case where error is not an Error object
      throw new Error("An unknown error occurred.");
    }
  }
};
