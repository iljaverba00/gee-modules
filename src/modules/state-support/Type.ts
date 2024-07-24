
export interface ResponseData {
    "listSubsidyInfoDto": ListSubsidyInfoDto[],
    "warnings": string[],
    "errors": string[],
    "primaryKey": number,
    "successes": string[],
    "message": string,
    "exception": string
}

export interface ListSubsidyInfoDto {
    id: number,
    data: {
        [key: string]: {
            label: string,
            value: unknown
        }
    }
}

export interface GroupingSubsidyInfoDto {
    [key: string]: ListSubsidyInfoDto[]
}

export interface Fields {
    [key: string]: {
        label: string,
        show: boolean
    }
}