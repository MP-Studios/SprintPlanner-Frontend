const API_BASE = process.env.API_BASE;

// TODO have these strings be arguments that are either the dev or local host
export const getDailyAssignments=`${API_BASE}/api/api/assignments/daily`;
export const getSprintAssignments=`${API_BASE}/assignments`;
export const getBackLog=`${API_BASE}/api/assignments/backlog`;
export const saveAssignments = `${API_BASE}/api/supabase/saveAssignmentView`;



// export const getDailyAssignments=`${API_BASE}/api/api/assignments/daily`;
// export const getSprintAssignments=`${API_BASE}/assignments`;
// export const getBackLog=`${API_BASE}/api/api/assignments/backlog`;
// export const saveAssignments = `${API_BASE}/api/supabase/saveAssignmentView`;

