import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";



export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/events`);
    //api/v1/events
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEventById = async (id: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/events/${id}`);
    console.log("RESPONSE", response)
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


