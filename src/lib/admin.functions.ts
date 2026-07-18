// Backwards-compat re-export shim. The real implementations now live in
// src/lib/api/admin.ts and hit the standalone Node.js backend.
export {
  checkAdminAccess,
  getAdminStats,
  listAdminUsers,
  setUserRole,
  listAdminCourses,
  createCourse,
  updateCourse,
  toggleCoursePublished,
  deleteCourse,
} from "@/lib/api/admin";
export type {
  AdminRole,
  AdminUserDto,
  AdminStatsDto,
  AdminCourseDto,
  CourseInputDto,
} from "@/lib/api/admin";
