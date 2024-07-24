export interface IUserForm {
  fullName: {
    valid: boolean
    value: string
  }
  nameLegalEntity: {
    valid: boolean
    value: string
  }
  inn: {
    valid: boolean
    value: string
  }
  powerAttorneyFile: {
    valid: boolean
    value: File
  }
  cadastralNumbers: {
    valid: boolean
    value: string[]
  }
  contourNumber: {
    valid: boolean
    value: string[]
  }
}

export interface IForm {
  fullName: string
  nameLegalEntity: string
  inn: string
  powerAttorneyFile: File
  cadastralNumbers: string
  contourNumber: string
  approval: boolean
}

export interface IChipScope {
  index: number
  opt: string
  html: boolean
  selected: boolean
  tabindex: number
  removeAtIndex: (index: number) => void
}
