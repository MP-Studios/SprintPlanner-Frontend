// utils/classColors.ts

'use client'
const TOTAL_COLORS = 8;
const STORAGE_KEY = "classColorMap";

let classColorMap: Record<string, number> | null = null;
let usedColors: Set<number> | null = null;

function safeLoadStorage(): void {
  if (typeof window == 'undefined') return;
  if (classColorMap !== null) return; // avoid re calls

  try {
    const storedMap = localStorage.getItem(STORAGE_KEY);
    classColorMap = storedMap ? JSON.parse(storedMap) : {};
    usedColors = new Set(Object.values(classColorMap!));
  }
  catch(err){
    console.warn("Failed to load class color map:", err);
    classColorMap  = {};
    usedColors = new Set();
  }
}

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
  safeLoadStorage();

  if (!classColorMap || !usedColors) return -1;

  // If already assigned, return it
  if (classColorMap[classId] !== undefined) {
    return classColorMap[classId];
  }

  // Rebuild usedColors each time to ensure it's current
  usedColors = new Set(Object.values(classColorMap));

  let colorNumber = hashString(classId) % TOTAL_COLORS;

  while (usedColors.has(colorNumber) && usedColors.size < TOTAL_COLORS) {
    colorNumber = (colorNumber + 1) % TOTAL_COLORS;
  }

  usedColors.add(colorNumber);
  classColorMap[classId] = colorNumber;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classColorMap));
  } catch (err) {
    console.warn("Failed to store class color map:", err);
  }

  return colorNumber;
}
