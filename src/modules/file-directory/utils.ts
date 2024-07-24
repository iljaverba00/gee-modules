import { uid } from 'quasar'

import type {
  IFolderRequestData,
  IFileOrFolder,
  IFile,
  UtilType,
  RequestsType,
} from './FileDirectoryTypes'

export default (requests: RequestsType): UtilType => {
  const {
    getDirectoryStructure,
    createFolder,
    deleteFromDirectory,
    downloadFile,
    uploadFile,
    isFileExist,
  } = requests

  const DATA_FOLDERS = [
    'CMR',
    'LAS',
    'LAS_RGB',
    'OBJ',
    'orto',
    'Orto_8cm',
    'panorami360',
    'Photo',
    'video_oblet',
    'Схема',
  ]

  /**
   * Returns the type of the item.
   *
   * @param {IFolderRequestData} item - The item to get the type of.
   * @return {string} The type of the item.
   */
  function getType(
    item: IFolderRequestData,
    parentType?: 'FILE' | 'FOLDER' | 'OBJECT_FOLDER' | 'DATE_FOLDER' | 'DATA_FOLDER' | 'ROOT',
  ) {
    const { name, type } = item

    if (type == 'FOLDER' && parentType == 'DATE_FOLDER' && DATA_FOLDERS.includes(name)) {
      return 'DATA_FOLDER'
    } else {
      return type
    }
  }

  /**
   * Retrieves the content of a folder specified by the given path.
   * @param path - The path of the folder.
   * @returns A promise that resolves with an array of file or folder objects.
   */
  const getFolderContent = async function (
    path: string,
    parentType?: 'FILE' | 'FOLDER' | 'OBJECT_FOLDER' | 'DATE_FOLDER' | 'DATA_FOLDER' | 'ROOT',
  ): Promise<IFileOrFolder[] | undefined> {
    const content = await getDirectoryStructure(path)
    if (!content) return

    return content.map(item => {
      const type = getType(item, parentType)

      return {
        type,
        name: item.name,
        path: `${path}${item.name}/`,
        uid: uid(),
        icon: getIcon(type),
        content: item.type == 'FILE' ? undefined : [],
        expanded: item.type == 'FILE' ? undefined : false,
        lazy: item.type == 'FILE' ? undefined : true,
        dataHasBeenRequested: item.type == 'FILE' ? undefined : false,
        color: getIcon(type, true),
      }
    })
  }

  /**
   * Returns the icon name based on the type.
   * @param type - The type of the icon ('file', 'folder', 'folderObject', 'root').
   * @param returnColor - Whether to return the icon color or not.
   * @returns The icon name or color.
   */
  function getIcon(
    type: 'FILE' | 'FOLDER' | 'OBJECT_FOLDER' | 'DATE_FOLDER' | 'DATA_FOLDER' | 'ROOT',
    returnColor = false,
  ) {
    switch (type) {
      case 'FILE':
        return returnColor ? 'grey' : 'description'
      case 'FOLDER':
        return returnColor ? 'orange-12' : 'folder'
      case 'OBJECT_FOLDER':
        return returnColor ? 'orange-14' : 'source'
      case 'DATE_FOLDER':
        return returnColor ? 'deep-orange-4' : 'folder_special'
      case 'DATA_FOLDER':
        return returnColor ? 'amber-12' : 'folder'
      case 'ROOT':
        return returnColor ? 'black' : 'account_tree'
    }
  }

  /**
   * Retrieves a node from a node tree based on its path.
   * @param nodeTree - The node tree to search in.
   * @param path - The path of the node to retrieve.
   * @returns The node if found, otherwise null.
   */
  const getNodeByPath = function (
    nodeTree: IFileOrFolder[] | null,
    path: string,
  ): IFileOrFolder | null {
    // If nodeTree is null or empty, return null
    if (!nodeTree || !nodeTree.length) return null
    // Iterate through each node in the nodeTree
    for (const node of nodeTree) {
      // If the node's path matches the desired path, return the node
      if (node.path == path) return node
      // If the node has content, recursively call getNodeByPath on the content
      if (node.content) {
        const result = getNodeByPath(node.content, path)
        // If a matching node is found in the content, return the result
        if (result) return result
      }
    }
    // If no matching node is found, return null
    return null
  }

  /**
   * Recursively populates a tree of file and folder objects.
   *
   * @param path - The path of the current folder.
   * @param rootPath - The root path of the tree.
   * @returns An array of file and folder objects representing the populated tree, or null if an error occurs.
   */
  const getNodesTreeByPath = async function (path: string): Promise<IFileOrFolder[] | null> {
    const folders = path.split('/').filter(item => !!item)

    const root: IFileOrFolder = {
      name: '/',
      path: '/',
      type: 'ROOT',
      icon: 'account_tree',
      content: await getFolderContent('/'),
      uid: 'root',
      expanded: false,
      lazy: true,
      dataHasBeenRequested: false,
      color: 'black',
    }

    let currentFolder = root
    for (const folderName of folders) {
      const folderPath = `${currentFolder.path}${folderName}/`
      const parentType = currentFolder.type
      const folderContent = await getFolderContent(folderPath, parentType)
      const folderNode = currentFolder.content?.find(item => item.name === folderName)

      try {
        if (folderNode) {
          folderNode.content = folderContent
          currentFolder = folderNode
        } else {
          throw new Error(`Folder ${folderName} not found in ${currentFolder.name}`)
        }
      } catch (e) {
        return null
      }
    }

    return [root]
  }

  /**
   * Create a folder by path.
   *
   * @param {string} path - The path of the folder to create.
   * @return {Promise<boolean | undefined>} - A promise that resolves to a boolean value indicating whether the folder was created successfully or not, or undefined if an error occurred.
   */
  const createFolderByPath = async function (path: string): Promise<boolean | undefined> {
    return createFolder(path)
  }

  /**
   * Creates a folder object based on the provided path and date.
   *
   * @param {string} path - The path of the folder.
   * @param {string} date - The date to be appended to the folder path.
   * @return {Promise<boolean | undefined>} A promise that resolves to a boolean indicating whether the folder object was successfully created or undefined if an error occurred.
   */
  const createFolderObjectByPath = async function (
    path: string,
    date: string,
  ): Promise<boolean | undefined> {
    const folderCreated = await createFolder(path)

    if (!folderCreated) return folderCreated

    const dateFolderPath = path + date + '/'
    return await createFolderDateByPath(dateFolderPath)
  }

  /**
   * Creates a folder with the current date appended to the given path.
   *
   * @param {string} path - The path where the folder should be created.
   * @return {Promise<boolean | undefined>} A promise that resolves to true if the folder was created successfully, false otherwise.
   */
  const createFolderDateByPath = async function (path: string): Promise<boolean | undefined> {
    const dateFolderCreated = await createFolder(path)

    if (!dateFolderCreated) return dateFolderCreated

    DATA_FOLDERS.forEach(folderName => {
      const folderPath = path + folderName + '/'
      createFolder(folderPath) as Promise<void>
    })

    return true
  }

  /**
   * Deletes a file or directory at the specified path.
   *
   * @param {string} path - The path to the file or directory.
   * @return {Promise<boolean | undefined>} A promise that resolves to a boolean indicating if the deletion was successful.
   */
  const deleteByPath = async function (path: string): Promise<boolean | undefined> {
    return deleteFromDirectory(path)
  }

  /**
   * Downloads a file from the given path and saves it with the specified file name.
   *
   * @param {string} path - The path of the file to download.
   * @param {string} fileName - The name to save the downloaded file as.
   * @return {Promise<boolean | undefined>} A promise that resolves to true if the file was successfully downloaded, undefined otherwise.
   */
  const downloadFileByPath = async function (
    path: string,
    fileName: string,
  ): Promise<boolean | undefined> {
    return downloadFile(path, fileName)
  }

  /**
   * Sends files by path.
   *
   * @param {string} path - The path to send the files to.
   * @param {FileList} files - The list of files to send.
   * @return {Promise<boolean | undefined>} A promise that resolves to a boolean indicating the success of the operation, or undefined if there was an error.
   */
  const sendFilesByPath = async function (
    path: string,
    file: IFile,
    fileName?: string,
  ): Promise<boolean | undefined> {
    const localePath =
      '/' +
      path
        .split('/')
        .concat(file.path.split('/'))
        .filter(item => !!item)
        .join('/') +
      '/'

    const tName = encodeURIComponent(fileName ?? file.file.name)

    const formData = new FormData()
    formData.append('file', file.file, tName)

    return await uploadFile(localePath, formData, fileName ?? file.file.name)
  }

  const getFilesPathByFiles = function (files: FileList): IFile[] {
    const newFiles: IFile[] = []

    for (const file of files) {
      const path = file.webkitRelativePath
      newFiles.push({ path: removeFilenameFromPath(path), file })
    }

    return newFiles
  }

  function removeFilenameFromPath(path: string): string {
    const folders = path
      .split('/')
      .filter(item => !!item)
      .slice(0, -1)

    if (!folders || !folders.length) return ''
    else return '/' + folders.join('/') + '/'
  }

  /**
   * Retrieves files from the given dataTransfer object and calls the callback function with the resulting files.
   *
   * @param {DataTransfer | null} dataTransfer - The dataTransfer object containing the files.
   * @param {(files: IFile[]) => Promise<void>} callback - The callback function to be called with the retrieved files.
   */
  const getFilesByDataTransfer = function (
    dataTransfer: DataTransfer | null,
    callback: (files: IFile[]) => Promise<void>,
  ) {
    if (dataTransfer && dataTransfer.items) {
      const items = dataTransfer.items
      void getFileEntry(items, async entries => {
        if (!entries.length) return

        const files = await Promise.all(
          entries.map(async entry => {
            return {
              path: removeFilenameFromPath(entry.fullPath),
              file: await getFileByEntry(entry as FileSystemFileEntry),
            }
          }),
        )

        void callback(files)
      })
    }
  }

  /**
   * Retrieves a File object given a FileSystemFileEntry.
   *
   * @param {FileSystemFileEntry} entry - The file system file entry.
   * @return {Promise<File>} A promise that resolves to the file object.
   */
  function getFileByEntry(entry: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve, reject) => entry.file(resolve, reject))
  }

  /**
   * Retrieves the file entries from the given DataTransferItemList and calls the callback function with the retrieved entries.
   *
   * @param {DataTransferItemList} items - The list of items from which to retrieve the file entries.
   * @param {(entry: FileSystemEntry[]) => Promise<void>} callback - The callback function to be called with the retrieved file entries.
   * @return {void}
   */
  function getFileEntry(
    items: DataTransferItemList,
    callback: (entry: FileSystemEntry[]) => Promise<void>,
  ): void {
    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      if (!entry) continue

      if (entry.isFile) {
        void callback([entry])
      } else if (entry.isDirectory) {
        void traverseDirectory(entry as FileSystemDirectoryEntry).then(entrys => {
          void callback(entrys.flat(Infinity))
        })
      }
    }
  }

  /**
   * Traverse a directory and return an array of all file entries within the directory.
   *
   * @param {FileSystemEntry} entry - The entry point of the directory to traverse.
   * @return {Promise<FileSystemEntry[]>} - A promise that resolves to an array of file entries.
   */
  function traverseDirectory(entry: FileSystemEntry): Promise<FileSystemEntry[]> {
    const reader = (entry as FileSystemDirectoryEntry).createReader()

    return new Promise(resolve => {
      const iterationAttempts: Promise<FileSystemEntry>[] = []
      const readEntries = () => {
        reader.readEntries(entries => {
          if (entries.length) {
            for (const entry of entries) {
              if (entry.isFile) iterationAttempts.push(Promise.resolve(entry))
              else
                iterationAttempts.push(
                  traverseDirectory(entry) as unknown as Promise<FileSystemEntry>,
                )
            }

            readEntries()
          } else {
            resolve(Promise.all(iterationAttempts))
          }
        })
      }

      readEntries()
    })
  }

  /**
   * Checks if a file exists at the specified path and file name.
   *
   * @param {string} path - The path to the directory where the file is located.
   * @param {string} fileName - The name of the file to check.
   * @return {Promise<boolean | undefined>} A promise that resolves to a boolean value indicating whether the file exists or not.
   */
  const checkFileExist = async function (
    path: string,
    file: IFile,
    fileName?: string,
  ): Promise<boolean | undefined> {
    const filePath =
      '/' +
      path
        .split('/')
        .concat(file.path.split('/'))
        .filter(item => !!item)
        .join('/') +
      '/'

    return await isFileExist(filePath, fileName ?? file.file.name)
  }

  /**
   * Creates a new file name by appending a counter to the given file name if it already exists in the specified path.
   *
   * @param {string} path - The path where the file is located.
   * @param {string} fileName - The name of the file.
   * @return {Promise<string>} - The new file name.
   */
  const creteNewFileName = async function (path: string, file: IFile): Promise<string> {
    let counter = 2
    const fileName = file.file.name

    const checkNewName = async (path: string, file: IFile, fileName: string): Promise<string> => {
      const isFileExist = await checkFileExist(path, file, fileName)

      if (isFileExist) {
        const newName = `${fileName.split('.')[0].replace(/ \(\d+\)$/g, '')} (${++counter}).${
          fileName.split('.')[1]
        }`
        return await checkNewName(path, file, newName)
      }

      return fileName
    }

    const newName = `${fileName.split('.')[0].replace(/ \(\d+\)$/g, '')} (${counter}).${
      fileName.split('.')[1]
    }`
    return await checkNewName(path, file, newName)
  }

  return {
    getFolderContent,
    getNodeByPath,
    getNodesTreeByPath,
    createFolderByPath,
    createFolderObjectByPath,
    createFolderDateByPath,
    deleteByPath,
    downloadFileByPath,
    sendFilesByPath,
    getFilesPathByFiles,
    getFilesByDataTransfer,
    checkFileExist,
    creteNewFileName,
  }
}
