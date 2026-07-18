const TOKEN = "b40381eea24fa053c1f9815f0"

const BASE_URL = "https://knightledger.iouring.in/api"

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${TOKEN}`,
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  if (!res.ok) throw new Error("API Request Failed");
  return res.json()
}

export function getUsers() {return get("/users")}
export function getActivities() {return get("/activities")}
export function getProjects() {return get("/projects")}
export function getTimesheetsForUser(userId) {return get(`/timesheets?user=${userId}`)}

export async function getAllTimesheets(users) {
  const responses = await Promise.all(
    users.map(async (user) => ({
      user,
      entries: await getTimesheetsForUser(user.id),
    }))
  );

  return responses;
}