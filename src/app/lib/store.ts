// Re-export from the shared db module so existing import paths keep working
export type { Category, Status, PartRequest } from '../../lib/db'
export { getRequests, addRequest, setStatus } from '../../lib/db'
