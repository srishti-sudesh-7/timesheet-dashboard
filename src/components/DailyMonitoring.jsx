import { useEffect, useState } from "react";
import { getUsers, getAllTimesheets } from "../api";
import { today } from "../dateUtils";

export default function DailyMonitoring() {
  const [missingToday, setMissingToday] = useState([]);
  const [threeDayDefaulters, setThreeDayDefaulters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {loadDashboard();}, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const users = await getUsers();
      const allTimesheets = await getAllTimesheets(users);

      const todayDate = today();
      const missing = [];
      const streaks = [];

      allTimesheets.forEach(({ user, entries }) => {
        const dates = entries
          .map((e) => e.begin.slice(0, 10))
          .sort();

        const submittedToday = dates.includes(todayDate);
        if (!submittedToday) missing.push(user);

        let consecutive = 0;
        for (let i=0; i<3; i++) {
          const d = new Date(todayDate);
          d.setDate(d.getDate() - i);
          const day = d.toISOString().slice(0, 10);
          if (!dates.includes(day)) consecutive++;
          else break;
        }

        if (consecutive>=3) streaks.push(user);
      });

      setMissingToday(missing);
      setThreeDayDefaulters(streaks);
    } finally {
      setLoading(false);
    }
  }

  function sendReminderToday() {
    alert(`Reminder sent to ${missingToday.length} employee(s). (Demo)`);
  }

  function sendReminderThreeDay() {
    alert(`Reminder sent to ${threeDayDefaulters.length} employee(s). (Demo)`);
  }

  if (loading)
    return (
      <section className="card">
        <h2>Daily Monitoring</h2>
        <p>Loading...</p>
      </section>
    );

  return (
    <section className="card">
      <h2>Daily Monitoring</h2>

      <div className="monitor-grid">

        <div className="monitor-box">
          <h3>Today's Defaulters</h3>

          {missingToday.length === 0 ? (
            <p>Everyone has submitted today's timesheet.</p>
          ) : (
            <>
              <div className="list-container">
                {missingToday.map((user) => (
                  <div className="user-row" key={user.id}>
                    {user.username}
                  </div>
                ))}
              </div>

              <button onClick={sendReminderToday}>
                Send Reminder to All
              </button>
            </>
          )}
        </div>

        <div className="monitor-box">
          <h3>3-Day Consecutive Defaulters</h3>

          {threeDayDefaulters.length === 0 ? (
            <p>No employee has missed three consecutive days.</p>) : 
            (<><div className="list-container">
                {threeDayDefaulters.map((user) => (
                  <div className="user-row" key={user.id}>
                    {user.username}
                  </div>
                ))}
              </div>

              <button onClick={sendReminderThreeDay}>
                Send Reminder to All
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}