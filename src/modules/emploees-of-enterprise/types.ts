export interface ITable {
  key: number
  records: IRecord[]
}

export interface IFile {
  docName: string
  docId: string
  folder: boolean
  fileDate: string
  url: string
}

export interface IRecord {
  recordId: number
  data: IData[]
  files?: IFile[]
  loading?:boolean
}

export interface IData {
  key: string
  value: TValue
  readonly: boolean
  emptyValue: boolean
  alias: string
  name: string
}

type TValue = string | number | null
