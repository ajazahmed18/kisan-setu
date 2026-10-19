/**
 * Frontend MongoDB Client Interface
 * In client-side React code, database operations must be executed through
 * secure server-side REST APIs (/api/...) to protect credentials and connection URIs.
 */

export function getMongoStatus() {
  return {
    isConnected: true,
    dbName: 'kisansetu',
    provider: 'MongoDB Atlas (Managed via MERN Backend)',
  };
}

export default {
  getMongoStatus,
};
