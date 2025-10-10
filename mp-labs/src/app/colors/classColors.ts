// utils/classColors.ts

const TOTAL_COLORS = 8;
const STORAGE_KEY = "classColorMap";

const storedMap = localStorage.getItem(STORAGE_KEY);
const classColorMap: Record<string, number> = storedMap ? JSON.parse(storedMap) : {};
const usedColors = new Set(Object.values(classColorMap));

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getClassColorNumber(classId: string | null | undefined): number {
  if (!classId) return -1; 

  if (classColorMap[classId] !== undefined) {
    return classColorMap[classId];
  }

  let colorNumber = hashString(classId) % TOTAL_COLORS;

  while (usedColors.has(colorNumber) && usedColors.size < TOTAL_COLORS) {
    colorNumber = (colorNumber + 1) % TOTAL_COLORS;
  }

  usedColors.add(colorNumber);
  classColorMap[classId] = colorNumber;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(classColorMap));

  return colorNumber;
}
