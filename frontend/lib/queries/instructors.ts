import { useQuery } from "@tanstack/react-query";
import { instructorsApi } from "@/lib/api";

export const instructorKeys = {
  me: ["instructor", "me"] as const,
  list: ["instructors"] as const,
};

export function useInstructorMe() {
  return useQuery({
    queryKey: instructorKeys.me,
    queryFn: instructorsApi.me,
  });
}

export function useInstructors() {
  return useQuery({
    queryKey: instructorKeys.list,
    queryFn: instructorsApi.list,
  });
}
