type Value = string | number | boolean

export interface IFile {
  docName: string
  docId: string
  folder: boolean
  fileDate: string
  url: string
}

export interface ICardRow {
  name: string
  value: Value
}

export interface IReasonRefusal {
  label: string
  value: Value
}

