import { Course } from "../types/courseType";
import { BASE_URL } from "./coreApi";

export const getCourses = async (token: string): Promise<Course[]> => {
  const url = new URL(BASE_URL + "/course/my?studentCourse=my");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });
  const data = await response.json();
  return data as Course[];
};
