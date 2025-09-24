// realm.ts
import Realm from "realm";
import { Platform } from "react-native";

export type Expense = {
  _id: string;
  amount: number;
  category: string;
  note?: string | null;
  date: Date;
};

// Realm schema
const ExpenseSchema: Realm.ObjectSchema = {
  name: "Expense",
  primaryKey: "_id",
  properties: {
    _id: "string",
    amount: "double",
    category: "string",
    note: "string?",
    date: "date"
  },
};

let realmInstance: Realm | null = null;

export function getRealm(): Realm {
  if (!realmInstance) {
    realmInstance = new Realm({ schema: [ExpenseSchema], schemaVersion: 1 });
  }
  return realmInstance;
}

// helper to close on app exit if needed
export function closeRealm() {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
}

// path to realm file for backup/restore
export function getRealmPath() {
  const r = getRealm();
  // @ts-ignore Realm has a path property
  return r.path as string;
}
