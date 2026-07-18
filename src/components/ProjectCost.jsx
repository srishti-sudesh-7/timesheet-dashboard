import {useEffect, useState} from "react";
import {getProjects} from "../api";

export default function ProjectCost({ entries }) {
  const [projects, setProjects] = useState([]);
  const [salaryMap, setSalaryMap] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [totalCost, setTotalCost] = useState(null);

  useEffect(() => {loadProjects();}, []);

  async function loadProjects() {
    const data = await getProjects();
    setProjects(data);
  }

  function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const lines = e.target.result.trim().split("\n");
      const salaries = {};

      for (let i=1; i<lines.length; i++) {
        const [userId, monthlyCTC] = lines[i].split(",");
        salaries[Number(userId)] = Number(monthlyCTC);
      }
      setSalaryMap(salaries);
      alert(`Loaded salaries for ${Object.keys(salaries).length} employees.`);
    };
    reader.readAsText(file);
  }

  function calculateCost() {
    if (!selectedProject) {
      alert("Select a project.");
      return;
    }

    const totalHours = {};
    const projectHours = {};

    entries.forEach((entry) => {
      const hours = entry.duration/3600;
      totalHours[entry.userId] = (totalHours[entry.userId] || 0) + hours;
      if (entry.project === Number(selectedProject))
        projectHours[entry.userId] =(projectHours[entry.userId] || 0) + hours;
    });

    let total = 0;

    Object.keys(projectHours).forEach((userId) => {
      const monthlyCTC = salaryMap[userId];
      if (!monthlyCTC) return;
      const allocation =projectHours[userId] / totalHours[userId];
      total += monthlyCTC * allocation;
    });

    setTotalCost(total);
  }

  return (
    <section className="card">
      <h2>Project Burn Calculator</h2>
      <div className="project-controls">
        <label>Upload Monthly CTC CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
        />
        <label>Select Project</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <button onClick={calculateCost}>Calculate Cost</button>
        {totalCost !== null && (
          <div className="cost-result">
            Total Project Cost: ₹{totalCost.toFixed(2)}
          </div>
        )}
      </div>
    </section>
  );
}