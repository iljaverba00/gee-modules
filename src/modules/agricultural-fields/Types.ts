export interface ITable {
  key: number
  records: IRecord[]
}

export interface IRecord {
  recordId: number
  data: IData[]
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
