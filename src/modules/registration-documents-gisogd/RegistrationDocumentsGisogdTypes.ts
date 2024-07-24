import type { ILayer } from '../../components/map/types'

export interface IFile {
  docName: string
  docId: string
  folder: boolean
  fileDate: string
  url: string
}

export interface IFilesGroup {
  files: IFile[]
  fdId: number
  factId: number
  uid: string
  label: string
}

export interface ICardRow {
  name: string
  value: Value
}

export interface IReasonRefusal {
  label: string
  value: Value
}

export interface ICardList {
  name: string
  expanded: boolean
  key: number
  classification?: { name: string; value: string }
  layers?: ILayer[]
}

export interface IDataLayer {
  card: ICardList
  layer?: ILayer
}

export interface IProcedure {
  name: string
  id: number
}

type Value = string | number | boolean
