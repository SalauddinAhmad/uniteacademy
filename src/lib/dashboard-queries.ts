import { queryOptions } from "@tanstack/react-query";
import { getOverview, getMyCourses, getCourseDetail } from "./dashboard.functions";

export const overviewQuery = () =>
  queryOptions({ queryKey: ["dashboard", "overview"], queryFn: () => getOverview() });

export const myCoursesQuery = () =>
  queryOptions({ queryKey: ["dashboard", "my-courses"], queryFn: () => getMyCourses() });

export const courseDetailQuery = (enrollmentId: string) =>
  queryOptions({
    queryKey: ["dashboard", "course-detail", enrollmentId],
    queryFn: () => getCourseDetail({ data: { enrollmentId } }),
  });
