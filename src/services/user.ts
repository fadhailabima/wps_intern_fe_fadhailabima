import axios from "axios";

export type User = {
  id: number;
  nama: string;
  username: string;
  email: string;
  nama_role: string;
  nama_divisi?: string;
};

export const getUser = async (token: string): Promise<User> => {
  try {
    const response = await axios.get("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.log(error);
    throw new Error(`Terjadi kesalahan dalam mendapatkan data user`);
  }
};
