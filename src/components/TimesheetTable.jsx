export default function TimesheetTable({ entries }) {
   return (
    <div className="table-wrapper">
      <table className="timesheet-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project</th>
            <th>Activity</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const hours = Math.floor(entry.duration/3600);
            const minutes = Math.floor((entry.duration % 3600)/60);
            return (
              <tr key={index}>
                <td>{entry.username}</td>
                <td>{entry.projectName}</td>
                <td>{entry.activityName}</td>
                <td>{entry.description || "-"}</td>
                <td>
                  {hours}h {minutes}m
                </td>
                <td>{entry.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}