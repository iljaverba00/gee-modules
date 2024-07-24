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
    disabled?: boolean
}

export interface IRecord {
    recordId: number
    data: IData[]
    files?: IFile[]
    color: string
    loading?:boolean
}
export interface INoAcceptedRecord {
    value: string
    decision: number | null
    response: string
    typeMessage: string
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

export interface IChipScope {
    index: number
    opt: string
    html: boolean
    selected: boolean
    tabindex: number
    removeAtIndex: (index: number) => void
}