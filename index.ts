type Value = string | null;
type ValueStore = { [k: string]: Value };

export const NoTransactionError = new Error("No transaction to rollback");

export class InMemoryDb {
  // data contains a list of transactions. The first item
  // in the array is the fully committed data and each
  // subsequent item is a transaction layered upon the
  // previous items.
  data: ValueStore[] = [{}];

  // get retrieves the current value associated with
  // the given key. If the key is not present, null is
  // returned.
  get(key: string): Value {
    for (let i = this.data.length - 1; i >= 0; i -= 1) {
      if (this.data[i][key] !== undefined) {
        return this.data[i][key];
      }
    }
    return null;
  }

  // set sets a given key to the provided value, overwriting
  // any existing value
  set(key: string, value: Value) {
    this.data[this.data.length - 1][key] = value;
  }

  // delete removes the given item from the database
  delete(key: string) {
    this.set(key, null);
  }

  // beginTransaction opens a new transaction
  beginTransaction(): void {
    this.data.push({});
  }

  // rollbackTransaction closes without commiting the last
  // opened transaction
  rollbackTransaction() {
    if (this.data.length === 1) {
      throw NoTransactionError;
    }
    this.data.pop();
  }

  // commitTransactions collapses all open transactions and
  // garbage collects any deleted items
  commitTransactions(): void {
    const collapsed = this.data.reduce((acc, trans) => ({ ...acc, ...trans }));
    this.data = [
      Object.fromEntries(
        Object.entries(collapsed).filter(([_, val]) => val !== null)
      )
    ];
  }
}
