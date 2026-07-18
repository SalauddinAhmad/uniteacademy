// Re-export query options and DTO types from the REST-backed dashboard module.
// Kept for backwards compatibility with existing route imports.
export {
  overviewQuery,
  myCoursesQuery,
  courseDetailQuery,
} from "@/lib/api/dashboard";
export type {
  ProfileDto,
  OverviewDto,
  ProgramEnrollmentDto,
  CourseCardDto,
  MyCoursesDto,
  CourseDetailDto,
} from "@/lib/api/dashboard";
