import { useState } from "react";
import {getUsers,getProjects,getActivities,getAllTimesheets,} from "../api";
import Controls from "./Controls";
import TimesheetTable from "./TimesheetTable";

export default function HistoricalReport({onReportLoaded}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchReport() {
    if (!startDate || !endDate) {
      alert("Select both dates.");
      return;
    }
    try {
      setLoading(true);
      const [users, projects, activities] =
        await Promise.all([getUsers(), getProjects(), getActivities(),]);

      const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));
      const activityMap = Object.fromEntries(activities.map((a) => [a.id, a.name]));

      const responses = await getAllTimesheets(users);
      const report = [];

      responses.forEach(({ user, entries }) => {
        entries.forEach((entry) => {
          const date = entry.begin.slice(0, 10);

          if (date<startDate || date>endDate) return;

          report.push({
            userId: user.id,
            username: user.username,
            project: entry.project,
            projectName: projectMap[entry.project] || "-",
            activityName: activityMap[entry.activity] || "-",
            description: entry.description,
            duration: entry.duration,
            date,
          });
        });
      });

    setEntries(report);
    onReportLoaded(report);
    } finally { setLoading(false);}
  }

  return (
    <section className="card">
      <h2>Report</h2>
      <Controls
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFetch={fetchReport}
        loading={loading}
      />
      {entries.length > 0 && (<TimesheetTable entries={entries} />)}
    </section>
  );
}