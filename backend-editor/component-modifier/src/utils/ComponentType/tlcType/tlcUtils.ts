export interface TLC_ROW {
  Term: string;
  Api: string;
  Attribute: string;
  Owner: string;
  Value: string;
  Description: string;
}

export interface TLC_DATA {
  code: TLC_ROW[];
}
