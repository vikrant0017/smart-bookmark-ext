const DB_NAME = "SmartBookmarksDB";
const STORE_NAME = "bookmarks";
const DB_VERSION = 1;

export class ConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConstraintError";
  }
}

// TODO: Convert into a more generic class to support different stores
export const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // REMINDER: these are event handlers not callbacks
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request.onupgradeneeded = (_event: IDBVersionChangeEvent) => {
      console.log("Upgrading db...");
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log("Creating store...", STORE_NAME);
        db.createObjectStore(STORE_NAME, {
          keyPath: "timestamp",
          autoIncrement: false,
        });
      }
    };

    /* These functions runs once after handlers like onupgradeneeded are fired, so
    we need to handle promise here */
    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const add = async (data: any) => {
  console.log("adding");
  const db = await openDB();
  console.log("db connection established");
  // Each transaction maintains ACID complicancy, therefore
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const req = store.add(data);
  return new Promise((resolve, reject) => {
    req.onerror = () => {
      // req.error is a generic DOMException instance but with different name and messages, depending
      // on the type of error so we are throwing a custom Error, for better error handling support
      if (req.error?.name?.includes("ConstraintError")) {
        reject(new ConstraintError(req.error.message));
      }
      // throw generic error DOMException if not one of the above Errors
      reject(req.error);
    };

    req.onsuccess = () => {
      resolve(req.result);
    };
  });
};

export const getAll = async () => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const req = store.getAll();
  return new Promise((resolve, reject) => {
    req.onerror = () => {
      reject(req.error);
    };

    req.onsuccess = () => {
      resolve(req.result);
    };
  });
};
