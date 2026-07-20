import { useQuery } from "@tanstack/react-query";
import { instructorsApi } from "../api";

export function useInstructorDashboard() {
  return useQuery({
    queryKey: ["instructor-dashboard"],
    queryFn: instructorsApi.dashboard,
  });
}