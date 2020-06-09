InMemoryDb
==========

This package represents a simple in-memory database with transaction support.

Quick start
-----------

```typescript
import { InMemoryDb } from "InMemoryDb"

const db = new InMemoryDb();
db.set("firstname", "ben");
console.log(db.get("firstname")); // prints "ben"
```

API
---

### `new InMemoryDb()`

Creates a new instance of the InMemoryDb with its own state

### `get(key)`

Gets the value of the given key

### `set(key, value)`

Sets a given key to the provided value

### `delete(key)`

Removes the given item from the database

### `beginTransaction()`

Begins a new transaction

### `rollbackTransaction()`

Closes the most recently opened transaction without committing it

### `commitTransactions()`

Collapses all open transactions, commits them and garbage collects any deleted
items

Running the tests
-----------------
The tests can be run with the following command:

```npm run test```

