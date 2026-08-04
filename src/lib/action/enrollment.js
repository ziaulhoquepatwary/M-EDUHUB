import axios from "axios";
import { apiHandler } from "./apiHandler";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`;

export const fetchMyEnrolledCourses = () => {
    return apiHandler(() => axios.get(`${API_URL}/my-courses`, { withCredentials: true }));
};