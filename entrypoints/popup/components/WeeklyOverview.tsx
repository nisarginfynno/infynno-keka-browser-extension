import pluralize from "pluralize";

interface WeeklyOverviewProps {
  loading: boolean;
  weeklyTarget: number;
  totalWorked: number;
  remaining: number;
  averageHours: number | null;
  hoursNeededPerDay: number | null;
  holidaysCount: number;
  leaveDaysCount: number;
  totalWorkingDays: number | null;
  currentWorkingDay: number | null;
  remainingWorkingDays: number | null;
}

export default function WeeklyOverview({
  loading,
  weeklyTarget,
  totalWorked,
  remaining,
  averageHours,
  hoursNeededPerDay,
  holidaysCount,
  leaveDaysCount,
  totalWorkingDays,
  currentWorkingDay,
  remainingWorkingDays,
}: WeeklyOverviewProps) {
  if (loading) {
    return <p className="loading">Loading weekly data...</p>;
  }

  // Format hours helper
  const formatHours = (val: number) => {
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="monthly-overview">
      {" "}
      {/* Reusing monthly-overview class for layout */}
      <div className="monthly-content">
        <div className="monthly-cards-row">
          <div className="monthly-card monthly-card-yellow">
            <div className="monthly-label">Weekly Target</div>
            <div className="monthly-value">{formatHours(weeklyTarget)}</div>
          </div>
          <div
            className={`monthly-card ${
              totalWorked >= weeklyTarget
                ? "monthly-card-green"
                : "monthly-card-yellow"
            }`}
          >
            <div className="monthly-label">Total Worked</div>
            <div className="monthly-value">{formatHours(totalWorked)}</div>
          </div>
        </div>

        <div className="monthly-cards-row">
          <div className="monthly-card monthly-card-yellow">
            <div className="monthly-label">Remaining</div>
            <div className="monthly-value">
              {remaining > 0 ? formatHours(remaining) : "Completed"}
            </div>
          </div>
          <div className="monthly-card monthly-card-green">
            <div className="monthly-label">Avg Hours/Day</div>
            <div className="monthly-value">
              {averageHours !== null && averageHours > 0
                ? formatHours(averageHours)
                : "—"}
            </div>
          </div>
        </div>

        <div className="monthly-cards-row">
          <div className="monthly-card">
            <div className="monthly-label">Needed/Day</div>
            <div className="monthly-value">
              {hoursNeededPerDay !== null && hoursNeededPerDay > 0
                ? formatHours(hoursNeededPerDay)
                : "—"}
            </div>
          </div>
          <div className="monthly-card monthly-card-yellow">
            <div className="monthly-label">Working Days</div>
            <div className="monthly-value">
              {currentWorkingDay !== null ? currentWorkingDay : "0"} /{" "}
              {totalWorkingDays !== null ? totalWorkingDays : "0"}
            </div>
          </div>
        </div>

        {remainingWorkingDays !== null && remainingWorkingDays > 0 && (
          <div className="holidays-info">
            <div className="holidays-label">
              {pluralize("day", remainingWorkingDays, true)} remaining this week
            </div>
          </div>
        )}

        {holidaysCount > 0 && (
          <div className="holidays-info">
            <div className="holidays-label">
              {pluralize("Holiday", holidaysCount, true)} this week
            </div>
          </div>
        )}
        {leaveDaysCount > 0 && (
          <div className="holidays-info">
            <div className="holidays-label">
              {pluralize("Leave day", leaveDaysCount, true)} this week
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
