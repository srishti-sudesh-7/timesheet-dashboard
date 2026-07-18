export default function Controls({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFetch,
  loading,
}) {
 return (
    <div className="controls">
      <div className="field">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            onStartDateChange(e.target.value)
          }
        />
      </div>

      <div className="field">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            onEndDateChange(e.target.value)
          }
        />
      </div>

      <button onClick={onFetch} disabled={loading}>
        {loading? "Fetching...":"Generate Report"}
      </button>
    </div>
  );
}
