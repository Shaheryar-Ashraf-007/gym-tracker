import * as SQLite from "expo-sqlite";
import { startOfDayISO } from "../utils/dates";

export type Exercise = "Bench Press" | "Squat" | "Deadlift" | "Overhead Press" | "Pull Ups" | "Other";
export type Workout = {
  id: number;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number; // kg
  notes: string;
  dayISO: string;
  createdAt: string;
};

const db = SQLite.openDatabaseSync("gym.db");

function nowISO() {
  return new Date().toISOString();
}

const DB = {
  initDb() {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise TEXT NOT NULL,
        sets INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        notes TEXT,
        dayISO TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  },

  addWorkout(input: Omit<Workout, "id" | "createdAt" | "dayISO"> & { dayISO?: string }) {
    const dayISO = input.dayISO ?? startOfDayISO();
    const stmt = db.prepareSync(
      `INSERT INTO workouts (exercise, sets, reps, weight, notes, dayISO, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?);`
    );
    try {
      const res = stmt.executeSync([
        input.exercise,
        input.sets,
        input.reps,
        input.weight,
        (input.notes ?? "").trim(),
        dayISO,
        nowISO(),
      ]);
      return Number(res.lastInsertRowId);
    } finally {
      stmt.finalizeSync();
    }
  },

  getWorkouts(limit = 100): Workout[] {
    return db.getAllSync<Workout>(
      `SELECT * FROM workouts ORDER BY createdAt DESC, id DESC LIMIT ?;`,
      [limit]
    ) ?? [];
  },

  deleteWorkout(id: number) {
    const stmt = db.prepareSync(`DELETE FROM workouts WHERE id = ?;`);
    try {
      stmt.executeSync([id]);
    } finally {
      stmt.finalizeSync();
    }
  },

  getTodayTotalSets() {
    const dayISO = startOfDayISO();
    const row = db.getFirstSync<{ s: number }>(
      `SELECT COALESCE(SUM(sets), 0) as s FROM workouts WHERE dayISO = ?;`,
      [dayISO]
    );
    return row?.s ?? 0;
  },

  // Extra feature support: Personal Record by exercise (max weight)
  getPRs(): { exercise: string; pr: number }[] {
    return db.getAllSync<{ exercise: string; pr: number }>(
      `SELECT exercise, MAX(weight) as pr FROM workouts GROUP BY exercise ORDER BY pr DESC;`
    ) ?? [];
  },

  getPRForExercise(exercise: string) {
    const row = db.getFirstSync<{ pr: number }>(
      `SELECT MAX(weight) as pr FROM workouts WHERE exercise = ?;`,
      [exercise]
    );
    return row?.pr ?? 0;
  },

  resetAll() {
    db.execSync(`DELETE FROM workouts;`);
  },
};

export default DB;
