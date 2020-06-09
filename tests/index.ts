import assert from "assert";

import { InMemoryDb, NoTransactionError } from "../index";

const tests: { [k: string]: (db: InMemoryDb) => void } = {
  "unset key returns null": db => {
    assert(db.get("something") === null);
  },
  "value can be retrieved": db => {
    db.set("name", "ben");
    assert(db.get("name") === "ben");
  },
  "transactions can be rolled back": db => {
    db.set("name", "ben");
    db.beginTransaction();
    db.set("name", "john");
    db.beginTransaction();
    db.set("name", "sam");
    assert(db.get("name") === "sam");
    db.rollbackTransaction();
    assert(db.get("name") === "john");
    db.rollbackTransaction();
    assert(db.get("name") === "ben");
  },
  "transactions can be committed": db => {
    db.set("firstname", "ben");
    db.beginTransaction();
    db.set("secondname", "elgar");
    db.beginTransaction();
    db.set("country", "uk");
    db.set("city", "london");
    db.delete("city");
    assert(db.get("firstname") === "ben");
    assert(db.get("secondname") === "elgar");
    assert(db.get("country") === "uk");
    assert(db.get("city") === null);
    db.commitTransactions();
    assert.deepEqual(db.data, [
      { firstname: "ben", secondname: "elgar", country: "uk" }
    ]);
  },
  "rolling back non-existent transactions": db => {
    try {
      db.rollbackTransaction();
    } catch (err) {
      if (err === NoTransactionError) {
        return;
      }
      throw err;
    }
    throw new Error("No error when rolling back non-existent transaction");
  }
};

if (require.main === module) {
  for (const [desc, func] of Object.entries(tests)) {
    console.log("==========");
    console.log(`Testing ${desc}`);
    const db = new InMemoryDb();
    try {
      func(db);
    } catch (err) {
      console.log("FAILED");
      throw err;
    }
    console.log("PASSED");
  }
}
