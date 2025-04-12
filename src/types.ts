export interface HandicapEntry {
  revDate: string;
  Value: number;
  LowHI?: string;
}

export interface PlayerData {
  name: string;
  data: HandicapEntry[];
}