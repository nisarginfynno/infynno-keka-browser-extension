import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  fetchAttendanceSummary,
  fetchHolidays,
  fetchLeaveSummary,
} from "../../../utils/api";
import { processWeeklyStats } from "../../../utils/calculations";
import type { WeeklyStats } from "../../../utils/types";

export const useWeeklyStats = (
  accessToken: string | null,
  isManualHalfDay: boolean,
) => {
  const [stats, setStats] = useState<WeeklyStats>({
    holidays: [],
    leaveDaysCount: 0,
    totalWorkingDays: null,
    currentWorkingDay: null,
    remainingWorkingDays: null,
    averageHours: null,
    hoursNeededPerDay: null,
    weeklyTarget: 0,
    totalWorked: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch same data as monthly: Attendance summary, holidays, leaves
        // Using Promise.all for parallel fetching
        const [attendanceData, holidaysData] = await Promise.all([
          fetchAttendanceSummary(accessToken),
          fetchHolidays(accessToken),
        ]);

        const now = new Date();
        const currentDateStr = format(now, "yyyy-MM-dd");
        let leaveData = null;
        try {
          // Fetch leave summary for today to check current status?
          // Actually processWeeklyStats processes leaves from history found in `fetchLeaveSummary`.
          // But `fetchLeaveSummary` takes `forDate`. Does it return history?
          // Let's check `api.ts` again or `types.ts`.
          // The interface `LeaveResponse` has `leaveHistory`.
          // Yes, `fetchLeaveSummary` returns that structure.
          leaveData = await fetchLeaveSummary(accessToken, currentDateStr);
        } catch (e) {
          // console.error("Failed to fetch leave data", e);
        }

        if (!attendanceData) throw new Error("Failed to fetch attendance");

        const processed = processWeeklyStats(
          attendanceData,
          holidaysData,
          leaveData,
          isManualHalfDay,
        );

        setStats(processed);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [accessToken, isManualHalfDay]); // Re-run if isManualHalfDay changes

  return { ...stats, loading, error };
};
