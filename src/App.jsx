import "./index.css";
import {useState} from 'react'
import DailyMonitoring from "./components/DailyMonitoring";
import HistoricalReport from "./components/HistoricalReport";
import ProjectCost from "./components/ProjectCost";

export default function App() {
  const [reportEntries, setReportEntries] = useState([]);
  return (
    <div className="container">

      <header className="page-header">
        <h1>Employee Timesheet Dashboard</h1>
        <p>
          Monitor employee timesheets on a daily basis
          and calculate project costs.
        </p>
      </header>
      <DailyMonitoring />
      <HistoricalReport onReportLoaded={setReportEntries}/>
      <ProjectCost entries={reportEntries}/>
    </div>
  );
}
