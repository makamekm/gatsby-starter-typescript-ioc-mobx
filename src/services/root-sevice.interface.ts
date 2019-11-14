export interface IRootService {
  loading?: boolean;
  useHook?(): void;
  onMount?(): void;
  onUnMount?(): void;
}
