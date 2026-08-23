export interface ErpTab {
  id: number;
  code: string;
  name: string;
  url: string;
  description: string;
  envName: string; // e.g., FPROD, FPROD_4, FPROD_5, etc.
  opened: boolean;
  openedAt?: string;
  isFirstTab?: boolean;
}

export type ConnectionStatus = 'not_started' | 'awaiting_login' | 'connected';

export type LaunchMode = 'all_at_once' | 'sequential_delay' | 'step_by_step';

export interface WorkflowState {
  step: 1 | 2 | 3; // 1: Connect, 2: Validate & Open rest, 3: All active
  connectionStatus: ConnectionStatus;
  openedTabIds: number[];
  launchMode: LaunchMode;
  delayBetweenTabsMs: number;
  requisitionId: string;
  businessUnit: string;
  processNotes: string;
}
