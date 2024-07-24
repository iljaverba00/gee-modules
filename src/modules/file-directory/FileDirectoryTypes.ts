export interface IFolderRequestData {
  name: string
  type: 'FILE' | 'FOLDER' | 'OBJECT_FOLDER' | 'DATE_FOLDER' | 'DATA_FOLDER' | 'ROOT'
}

export interface IFileOrFolder extends IFolderRequestData {
  path: string
  uid: string
  icon: string
  color: string
  content?: IFileOrFolder[]
  expanded?: boolean
  lazy?: boolean
  dataHasBeenRequested?: boolean
}

export interface RequestsType {
  getRootPath: () => Promise<string | undefined>
  getDirectoryStructure: (path: string) => Promise<IFolderRequestData[] | undefined>
  downloadFile: (path: string, fileName: string) => Promise<boolean | undefined>
  createFolder: (path: string) => Promise<boolean | undefined>
  deleteFromDirectory: (path: string) => Promise<boolean | undefined>
  uploadFile: (path: string, fileData: FormData, fileName: string) => Promise<boolean | undefined>
  isFileExist: (path: string, fileName: string) => Promise<boolean | undefined>
}

export interface UtilType {
  getFolderContent: (
    path: string,
    parentType?: 'FILE' | 'FOLDER' | 'OBJECT_FOLDER' | 'DATE_FOLDER' | 'DATA_FOLDER' | 'ROOT',
  ) => Promise<IFileOrFolder[] | undefined>
  getNodeByPath: (nodeTree: IFileOrFolder[] | null, path: string) => IFileOrFolder | null
  getNodesTreeByPath: (path: string) => Promise<IFileOrFolder[] | null>
  createFolderByPath: (path: string) => Promise<boolean | undefined>
  createFolderObjectByPath: (path: string, date: string) => Promise<boolean | undefined>
  createFolderDateByPath: (path: string) => Promise<boolean | undefined>
  deleteByPath: (path: string) => Promise<boolean | undefined>
  downloadFileByPath: (path: string, fileName: string) => Promise<boolean | undefined>
  sendFilesByPath: (path: string, file: IFile, fileName?: string) => Promise<boolean | undefined>
  getFilesPathByFiles: (files: FileList) => IFile[]
  getFilesByDataTransfer: (
    dataTransfer: DataTransfer | null,
    callback: (files: IFile[]) => Promise<void>,
  ) => void
  checkFileExist: (path: string, file: IFile, fileName?: string) => Promise<boolean | undefined>
  creteNewFileName: (path: string, file: IFile) => Promise<string>
}

export interface ILazyLoadData {
  node: IFileOrFolder
  key: string
  done: (data: IFileOrFolder[]) => void
  fail: () => void
}

export interface IFile {
  path: string
  file: File
}

export interface IFileUploadData {
  parentPath: string
  file: IFile
}

export interface IDecisionData extends IFileUploadData {
  decision: 'replace' | 'skip' | 'save'
}
