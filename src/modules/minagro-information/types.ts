export interface IRows {
  data: { [key: string]: string | number };
  fieldId: number;
  recordId: number;
  tableId: number;
}

export interface IColumns {
  name: string;
  label: string;
  field: string;
  fieldKey: number;
  readonly: boolean;
  options?: IOption[];
  type?: string;
  serverType?: number;
}

export interface IOption {
  id: number;
  label: string;
}

export interface ISaveValue {
  value?: number | string; //на самом деле он обязательный
  fieldId: number;
  recordId: number;
}

export interface IAlternativity {
  currentYear: { label: string; year: string };
  otherYears: { label: string; year: string }[];
}
