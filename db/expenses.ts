import { getRealm } from "./realm";
import { ObjectId } from "bson";

export type NewExpense = {
  amount: number;
  category: string;
  note?: string;
  date?: Date;
};

export function addExpense(exp: NewExpense) {
  const realm = getRealm();
  realm.write(() => {
    realm.create("Expense", {
      _id: new ObjectId().toString(),
      amount: exp.amount,
      category: exp.category,
      note: exp.note ?? null,
      date: exp.date ?? new Date(),
    });
  });
}

export function updateExpense(id: string, updates: Partial<NewExpense>) {
  const realm = getRealm();
  const obj = realm.objectForPrimaryKey("Expense", id);
  if (!obj) return;
  realm.write(() => {
    if (updates.amount !== undefined) obj.amount = updates.amount;
    if (updates.category !== undefined) obj.category = updates.category;
    if ("note" in updates) obj.note = updates.note ?? null;
    if (updates.date !== undefined) obj.date = updates.date;
  });
}

export function deleteExpense(id: string) {
  const realm = getRealm();
  const obj = realm.objectForPrimaryKey("Expense", id);
  if (!obj) return;
  realm.write(() => {
    realm.delete(obj);
  });
}

export function getAllExpenses() {
  const realm = getRealm();
  return realm.objects<any>("Expense").sorted("date", true); // newest first
}
