export interface ReconciliationRun {
  id: string;
  tenantId: string;
  sourceProvider?: string;
  status: string;
  createdAt: string;
}
