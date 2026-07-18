export function formatDate(date) {return date.toISOString().split("T")[0];}
export function today() {return formatDate(new Date());}

export function dateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current<=end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function isWithinRange(date, start, end) {
  return date>=start && date<=end;
}

export function groupConsecutiveDates(dates) {
  if (!dates.length) return [];
  const groups = [];
  let current = [dates[0]];

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const cur = new Date(dates[i]);
    const diff = (cur-prev)/(1000*60*60*24);

    if (diff === 1) current.push(dates[i]);
    else {
      groups.push(current);
      current = [dates[i]];
    }
  }

  groups.push(current);
  return groups;
}

export function getMissingDays(userId, entries, startDate, endDate) {
  const days = dateRange(startDate, endDate);
  return days.filter((day) =>
      !entries.some((entry) =>
          entry.userId === userId &&
          entry.date === day
      )
  );
}