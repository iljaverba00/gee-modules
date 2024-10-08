export interface ITable {
  key: number
  record: IRecord
}
export interface IFile {
  docName: string
  docId: string
  folder: boolean
  fileDate: string
  url: string
  disabled?: boolean
}

export interface IRecord {
  recordId: number
  data: IData[]
  files: IFile[]
}
export interface MessageRecords {
  [key:number]: MessageRecord[]
}

export interface MessageRecord {
  idsFile: string[]|undefined
  response: string|null
  status: number|null
  idMessage: number
}

export interface IData {
  key: string
  value: TValue
  readonly: boolean
  emptyValue: boolean
  alias: string
  name: string
}

export interface IReportsList {
  name: string
  id: number
}

type TValue = string | number | null
