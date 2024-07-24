import {
  getUserCertificates,
  isValidSystemSetup,
  createHash,
  createDetachedSignature,
  addAttachedSignature,
  addDetachedSignature,
} from 'crypto-pro-js'

import type {
  IFile,
  IFilesGroup,
} from '../modules/registration-documents-gisogd/RegistrationDocumentsGisogdTypes'
import type { Certificate } from 'crypto-pro-js/lib/api/certificate'

const getType = (name: string, allFiles: IFile[]) => {
  const SIG = 'sig'

  const fileIsSoloSig = (name: string) => {
    let _name: string | string[] = name.split('.')
    _name.pop()
    _name = _name.join('.')

    const solo = allFiles.findIndex(el => el.docName == _name)

    return solo === -1
  }

  const format = name.split('.')?.pop()?.toLowerCase() ?? ''

  if (format == SIG)
    return fileIsSoloSig(name) ? 'signedIn' : 'signature'
  else if (allFiles.find(el => el.docName == `${name}.sig`))
    return 'fileIsSigned'
  else return 'fileNotSigned'
}

const getFileBlob = async (
  url: string,
  type: string = 'text',
): Promise<string | ArrayBuffer> => {
  return await fetch(url)
    .then(data => data.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = () => reject('')
          reader.abort = () => reject('')

          reader.onload = () => {
            if (reader.result) resolve(reader.result)
            else resolve('')
          }

          if (type == 'text') reader.readAsText(blob)
          else reader.readAsArrayBuffer(blob)
        }),
    )
}

const createDettachedSign = async (
  file: IFile,
  certificate: Certificate,
) => {
  const blob = await getFileBlob(file.url, 'blob')
  const cache = await createHash(blob)

  return await createDetachedSignature(certificate.thumbprint, cache)
}

const addAttachedSign = async (
  file: IFile,
  certificate: Certificate,
) => {
  const cache = await getFileBlob(file.url, 'text')

  return await addAttachedSignature(certificate.thumbprint, cache)
}

const addDetachedSign = async (
  fileSign: IFile,
  fileOrign: IFile,
  certificate: Certificate,
) => {
  const cacheSign = await getFileBlob(fileSign.url, 'text')

  const blobOrign = await getFileBlob(fileOrign.url, 'blob')

  const cacheOrign = await createHash(blobOrign)

  return await addDetachedSignature(
    certificate.thumbprint,
    cacheSign,
    cacheOrign,
  )
}

const getSigningFiles = async (
  filesGroup: IFilesGroup[],
  certificate: Certificate,
) => {
  const findOrignFile = (file: IFile, files: IFile[]) => {
    let orignFileName: string | string[] = file.docName.split('.')
    orignFileName.pop()
    orignFileName = orignFileName.join('.')

    return files.find(file => file.docName == orignFileName) ?? null
  }

  return await Promise.all(
    filesGroup.map(async group => {
      const files = group.files

      const signs = []

      for (const file of files) {
        const type = getType(file.docName, files)
        switch (type) {
          case 'signature': {
            const orignFile = findOrignFile(file, files)
            if (!orignFile) break

            const sign = await addDetachedSign(
              file,
              orignFile,
              certificate,
            )
            const blob = new Blob([sign])
            const fileSign = new File([blob], file.docName)

            signs.push({ fileSign, type })
            break
          }
          case 'signedIn': {
            const sign = await addAttachedSign(file, certificate)
            const blob = new Blob([sign])
            const fileSign = new File([blob], file.docName)

            signs.push({ fileSign, type })
            break
          }
          case 'fileIsSigned': {
            break
          }
          case 'fileNotSigned': {
            const sign = await createDettachedSign(file, certificate)
            const blob = new Blob([sign])
            const fileSign = new File([blob], file.docName + '.sig')

            signs.push({ fileSign, type })
            break
          }
        }
      }

      return {
        ...group,
        signs,
      }
    }),
  )
}

export {
  getUserCertificates as getCertificates,
  isValidSystemSetup as isValidSystem,
  getSigningFiles,
}
