export type Data = {
  [key: string]: object | string | number | null | boolean | { epochSecond: number; nano: number };
};
export type DateEpoch = { epochSecond: number; nano: number };
export interface FormData {
  name: string;
  value: object | string | number | null | boolean | { epochSecond: number; nano: number };
  alias: string;
}

export interface DisplayValues {
  active: boolean;
  name: string;
  company: string;
  messageType?: number;
  date: string;
  data: Record[];
  recordId?: number;
}
// export type RecordData = {
//   key: string;
//   value: string | boolean | string[];
//   alias: string;
//   name: string;
//   restoreCadNums: { show: boolean; values: { index: number; value: string }[] };
// };
export interface DataRecords {
  recordId: number;
  data: Record[];
  active: boolean;
}
export type Record = {
  key: string;
  value: string | boolean | number | string[] | null;
  alias: string;
  name: string;
  restoreCadNums: { show: boolean; values: string[] };
};

export interface IFile {
  docName: string;
  docId: string;
  fileDate: string;
  folder: boolean;
}
