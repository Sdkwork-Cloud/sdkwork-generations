export interface CreateReconciliationRunRequest {
  tenantId: string;
  sourceProvider?: string;
  operatorId: string;
  dryRun?: boolean;
}
