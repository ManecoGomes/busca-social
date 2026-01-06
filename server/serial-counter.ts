import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const COUNTER_FILE = join(process.cwd(), ".serial-counter");

let currentCounter = 0;
let isInitialized = false;

function loadCounter(): number {
  try {
    if (existsSync(COUNTER_FILE)) {
      const data = readFileSync(COUNTER_FILE, "utf-8");
      return parseInt(data.trim(), 10) || 0;
    }
  } catch (error) {
    console.error("[Serial Counter] Error loading counter file:", error);
  }
  return 0;
}

function saveCounter(value: number): void {
  try {
    writeFileSync(COUNTER_FILE, value.toString(), "utf-8");
  } catch (error) {
    console.error("[Serial Counter] Error saving counter file:", error);
  }
}

function initialize(): void {
  if (!isInitialized) {
    currentCounter = loadCounter();
    isInitialized = true;
    console.log(`[Serial Counter] Initialized at ${currentCounter}`);
  }
}

export function getNextSerialNumber(): number {
  initialize();
  
  currentCounter++;
  saveCounter(currentCounter);
  
  console.log(`[Serial Counter] Generated: ${currentCounter}`);
  return currentCounter;
}

export function getCurrentSerialNumber(): number {
  initialize();
  return currentCounter;
}
