export interface HandicapEntry {
  revDate: string;
  Value: number;
  LowHI?: number | null;
}

export interface PlayerData {
  name: string;
  data: HandicapEntry[];
  currentHandicap: number;
  lowestHandicap: number;
}