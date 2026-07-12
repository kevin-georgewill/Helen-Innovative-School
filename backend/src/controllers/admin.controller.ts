// stats              — aggregate counts: total students, total courses, total revenue, recent enrollments
// listStudents       — select all profiles with role='student', join enrollment count
// suspendStudent     — update enrollments status to 'suspended' for all of a student's active enrollments
// deleteStudent      — delete profile row (Supabase Auth user is not deleted; only profile + enrollments)
// listCourses        — select all courses with is_published, join enrollment count per course
// publishCourse      — toggle is_published on courses row by id
// deleteCourse       — delete course row; modules/lessons/enrollments cascade via FK
// approveCertificate — call certificate.ts service to generate PDF + QR, insert certificates row
