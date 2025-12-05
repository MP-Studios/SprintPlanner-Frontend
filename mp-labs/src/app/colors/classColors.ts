// utils/classColors.ts

'use client'

export type ColorPalette = {
  id: string;
  name: string;
  colors: number;
};

export const colorPalettes: Record<string, ColorPalette> = {
  default: {
    id: 'default',
    name: 'Default',
    colors: 8,
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    colors: 8,
  },
};

//const TOTAL_COLORS = 8;
const STORAGE_KEY_MAP = "classColorMap";
const STORAGE_KEY_PALETTE = "selectedPalette";
const STORAGE_KEY_CUSTOM_COLORS = "customColorPalette";

let classColorMap: Record<string, number> | null = null;
let usedColors: Set<number> | null = null;
let currentPalette: string = colorPalettes.default.id;
let totalColors: number = colorPalettes.default.colors;
let nextAvailableColor: number = 0;

export type CustomColor = {
  background: string;
  hover: string;
  text: string;
};

const PALETTE_COLORS: Record<string, CustomColor[]> = {
  default: [
    { background: '#b5e5fc', hover: '#66C7F4', text: '#1E3A8A' },
    { background: '#cbb9ff', hover: '#a082fb', text: '#371F76' },
    { background: '#DCFCE7', hover: '#86EFAC', text: '#14532D' },
    { background: '#FFD4A1', hover: '#FFB347', text: '#7C2D12' },
    { background: '#FCE7F3', hover: '#F9A8D4', text: '#831843' },
    { background: '#CCFBF1', hover: '#5EEAD4', text: '#134E4A' },
    { background: '#FEF9C3', hover: '#FACC15', text: '#78350F' },
    { background: '#FFE4E6', hover: '#FB7185', text: '#881337' },
  ],
};

function safeLoadStorage(): void {
  if (typeof window == 'undefined') return;
  if (classColorMap !== null) return; // avoid re calls

  try {
    const storedMap = localStorage.getItem(STORAGE_KEY_MAP);
    classColorMap = storedMap ? JSON.parse(storedMap) : {};
    usedColors = new Set(Object.values(classColorMap!));

    const storedPalette = localStorage.getItem(STORAGE_KEY_PALETTE);
    if (storedPalette && colorPalettes[storedPalette]) {
      currentPalette = storedPalette;
      totalColors = colorPalettes[storedPalette].colors;
    }
    updateNextAvailableColor();
  } catch(err){
    console.warn("Failed to load class color map:", err);
    classColorMap  = {};
    usedColors = new Set();
    currentPalette = colorPalettes.default.id;
    totalColors = colorPalettes.default.colors;
    nextAvailableColor = 0;
  }
}

function saveColorMap(): void {
  if (typeof window === 'undefined' || !classColorMap) return;
  try {
    localStorage.setItem(STORAGE_KEY_MAP, JSON.stringify(classColorMap));
  } catch (err){
    console.warn("Failed to save class color map:", err);
  }
}

function updateNextAvailableColor(): void {
  if (!usedColors) return;
  
  for (let i = 0; i < totalColors; i++) {
    if (!usedColors.has(i)) {
      nextAvailableColor = i;
      return;
    }
  }
  nextAvailableColor = usedColors.size % totalColors;
}

function getNextColor(): number {
  if (!usedColors) return 0;
  
  if (usedColors.size < totalColors) {
    let color = nextAvailableColor;
    while (usedColors.has(color) && color < totalColors) {
      color++;
    }
    
    if (color >= totalColors) {
      for (let i = 0; i < totalColors; i++) {
        if (!usedColors.has(i)) {
          color = i;
          break;
        }
      }
    }
    return color;
  }
  
  const color = usedColors.size % totalColors;
  console.warn(
    `All ${totalColors} colors are in use. Reusing color ${color}.`
  );
  return color;
}

export function getClassColorNumber(classId: string | null | undefined): number {
  if (!classId) return -1;

  safeLoadStorage();

  if (!classColorMap || !usedColors) {
    return -1;
  }

  const existing = classColorMap[classId];
  if (existing !== undefined) {
    return existing;
  }

  const colorNumber = getNextColor();
  classColorMap[classId] = colorNumber;
  usedColors.add(colorNumber);
  saveColorMap();

  console.log(
    `Assigned color ${colorNumber} to class ${classId}. Used colors: ${Array.from(usedColors).sort()}`
  );
  return colorNumber;
}

export function getCurrentPalette(): string {
  safeLoadStorage();
  return currentPalette;
}

export function setPalette(paletteId: string): boolean {
  if (!colorPalettes[paletteId]) {
    console.warn(`Palette '${paletteId}' does not exist.`);
    return false;
  }

  safeLoadStorage();
  currentPalette = paletteId;
  totalColors = colorPalettes[paletteId].colors;

  try {
    localStorage.setItem(STORAGE_KEY_PALETTE, paletteId);    
    reassignAllColors();
    injectPaletteStyles(paletteId);
    
    return true;
  } catch (err) {
    console.warn("Failed to save palette selection:", err);
    return false;
  }
}

export function getAvailablePalettes(): ColorPalette[] {
  return Object.values(colorPalettes);
}

function reassignAllColors(): void {
  if (!classColorMap) return;
  const classIds = Object.keys(classColorMap);
  classColorMap = {};
  usedColors = new Set();
  nextAvailableColor = 0;

  classIds.forEach(classId => {
    getClassColorNumber(classId);
  });
}

export function resetAllColors(): void {
  safeLoadStorage();  
  classColorMap = {};
  usedColors = new Set();
  nextAvailableColor = 0;
  saveColorMap();
}

export function clearColorMap(): void {
  if (typeof window === 'undefined') return;
  
  classColorMap = null;
  usedColors = null;
  currentPalette = colorPalettes.default.id;
  totalColors = colorPalettes.default.colors;
  nextAvailableColor = 0;
  
  try {
    localStorage.removeItem(STORAGE_KEY_MAP);
    console.log('Color map cleared from localStorage');
  } catch (err) {
    console.warn('Failed to clear color map:', err);
  }
}

export function setClassColor(classId: string, colorNumber: number): boolean {
  if (colorNumber < 0 || colorNumber >= totalColors) {
    console.warn(`Color number ${colorNumber} is out of range for current palette.`);
    return false;
  }

  safeLoadStorage();

  if (!classColorMap || !usedColors) {
    return false;
  }

  const existingClass = Object.entries(classColorMap).find(
    ([id, color]) => color === colorNumber && id !== classId
  );

  if (existingClass) {
    console.warn(`Color ${colorNumber} is already assigned to class ${existingClass[0]}.`);
    return false;
  }

  if (classColorMap[classId] !== undefined) {
    usedColors.delete(classColorMap[classId]);
  }

  classColorMap[classId] = colorNumber;
  usedColors.add(colorNumber);
  updateNextAvailableColor();
  saveColorMap();

  return true;
}

export function removeClassColor(classId: string): void {
  safeLoadStorage();
  
  if (!classColorMap || !usedColors) return;
  
  const colorNumber = classColorMap[classId];
  if (colorNumber !== undefined) {
    delete classColorMap[classId];
    usedColors.delete(colorNumber);
    updateNextAvailableColor();
    saveColorMap();
    console.log(`Removed color assignment for class: ${classId}`);
  }
}

export function getAvailableColors(): number[] {
  safeLoadStorage();
  
  if (!usedColors) return [];

  const available: number[] = [];
  for (let i = 0; i < totalColors; i++) {
    if (!usedColors.has(i)) {
      available.push(i);
    }
  }
  
  return available;
}

export function getAllClassColors(): Record<string, number> {
  safeLoadStorage();
  return classColorMap ? { ...classColorMap } : {};
}

export function saveCustomPalette(colors: CustomColor[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_COLORS, JSON.stringify(colors));
    colorPalettes.custom.colors = colors.length;
    return true;
  } catch (err) {
    console.warn("Failed to save custom palette:", err);
    return false;
  }
}

export function getCustomPalette(): CustomColor[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_COLORS);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn("Failed to load custom palette:", err);
    return null;
  }
}

// dynamic css
function generateColorCSS(colorIndex: number, color: CustomColor): string {
  return `
    .assignment-card.color-${colorIndex} {
      background-color: ${color.background};
      border-left-color: ${color.hover};
    }

    .assignment-card.color-${colorIndex}:hover {
      background-color: ${color.hover};
    }

    .assignment-card.color-${colorIndex} .class-badge {
      color: ${color.text};
      border-color: ${color.hover};
    }

    .assignment-card.color-${colorIndex} .assignment-title {
      color: ${color.text};
    }
  `;
}

export function injectPaletteStyles(paletteId: string): void {
  if (typeof window === 'undefined') return;

  const existingStyle = document.getElementById('dynamic-palette-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  let colors: CustomColor[];
  if (paletteId === 'custom') {
    const customPalette = getCustomPalette();
    if (!customPalette) {
      console.warn('No custom palette found');
      return;
    }
    colors = customPalette;
  } else {
    colors = PALETTE_COLORS[paletteId] || PALETTE_COLORS.default;
  }

  const css = colors.map((color, index) => generateColorCSS(index, color)).join('\n');

  const styleElement = document.createElement('style');
  styleElement.id = 'dynamic-palette-styles';
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
}

export function initializePaletteStyles(): void {
  if (typeof window === 'undefined') return;
  
  safeLoadStorage();
  injectPaletteStyles(currentPalette);
}

export function refreshColorAssignments(activeClassIds: string[]): boolean {
  try {
    safeLoadStorage();
    
    if (!classColorMap || !usedColors) {
      console.warn('Color map not initialized');
      return false;
    }

    const activeSet = new Set(activeClassIds);
    const staleClasses: string[] = [];
    
    Object.keys(classColorMap).forEach(classId => {
      if (!activeSet.has(classId)) {
        staleClasses.push(classId);
      }
    });

    staleClasses.forEach(classId => {
      const color = classColorMap![classId];
      delete classColorMap![classId];
      usedColors!.delete(color);
      console.log(`Removed stale class: ${classId} (color ${color})`);
    });

    if (activeClassIds.length < totalColors) {
      const currentAssignments = new Map<string, number>();
      Object.entries(classColorMap).forEach(([id, color]) => {
        if (activeSet.has(id)) {
          currentAssignments.set(id, color);
        }
      });

      const assignedColors = new Set(currentAssignments.values());
      
      if (assignedColors.size !== currentAssignments.size) {
        console.log('Duplicate colors detected, reassigning...');
        
        classColorMap = {};
        usedColors = new Set();
        nextAvailableColor = 0;
        
        activeClassIds.forEach(classId => {
          getClassColorNumber(classId);
        });
        
        console.log('Color assignments refreshed - all classes have unique colors');
      }
    }

    updateNextAvailableColor();
    saveColorMap();
    
    return true;
  } catch (err) {
    console.error('Failed to refresh color assignments:', err);
    return false;
  }
}

export async function refreshClassColors(
  supabaseClient: any,
  apiEndpoint: string = "/api/fetchBacklog/"
): Promise<string[]> {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      console.warn('No active session for refreshing class colors');
      return [];
    }

    const res = await fetch(apiEndpoint, {
      headers: {
        "Authorization": `Bearer ${session.access_token}`
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch assignments:', res.statusText);
      return [];
    }

    const assignments = await res.json();
    
    if (!Array.isArray(assignments)) {
      console.warn('Invalid assignments data received');
      return [];
    }

    const uniqueClasses = [
      ...new Map(
        assignments
          .filter((a: any) => a.className && a.ClassId)
          .map((a: any) => [a.ClassId, { id: a.ClassId, name: a.className }])
      ).values(),
    ];

    const classIds = uniqueClasses.map((c: any) => c.id);
    
    refreshColorAssignments(classIds);
    
    console.log('Class colors refreshed:', uniqueClasses);
    return classIds;
    
  } catch (err) {
    console.error('Failed to refresh class colors:', err);
    return [];
  }
}