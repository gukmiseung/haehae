const databaseName = 'haehae-inspection-history'
const storeName = 'records'

let connection

function openHistory() {
  if (!connection) {
    connection = new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1)
      request.onupgradeneeded = () => {
        const store = request.result.createObjectStore(storeName, { keyPath: ['userId', 'id'] })
        store.createIndex('userId', 'userId')
      }
      request.onsuccess = () => {
        const database = request.result
        database.onversionchange = () => {
          database.close()
          connection = undefined
        }
        database.onclose = () => { connection = undefined }
        resolve(database)
      }
      request.onerror = () => reject(request.error)
    }).catch((error) => {
      connection = undefined
      throw error
    })
  }

  return connection
}

async function transact(mode, query) {
  const database = await openHistory()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    const request = query(transaction.objectStore(storeName))
    transaction.oncomplete = () => resolve(request.result)
    transaction.onabort = () => reject(transaction.error ?? new Error('Inspection history transaction aborted'))
  })
}

export async function readInspectionHistory(userId) {
  const records = await transact('readonly', (store) => store.index('userId').getAll(userId))
  return records.sort((first, second) => second.createdAt - first.createdAt)
}

export function saveInspectionRecord(record) {
  return transact('readwrite', (store) => store.put(record))
}

export function deleteInspectionRecord(userId, id) {
  return transact('readwrite', (store) => store.delete([userId, id]))
}
