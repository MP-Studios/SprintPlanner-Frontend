const API_BASE = process.env.API_BASE;

export const getDailyAssignments=`${API_BASE}/api/assignments/daily`;
export const getSprintAssignments=`${API_BASE}/api/assignments`;
export const getBackLog=`${API_BASE}/api/assignments/backlog`;
export const saveAssignments = `${API_BASE}/api/supabase/saveAssignment`;
export const updateAssignment = `${API_BASE}/api/supabase/updateAssignment`;
export const getStartDates = `${API_BASE}/api/fetchSprintDates`;
