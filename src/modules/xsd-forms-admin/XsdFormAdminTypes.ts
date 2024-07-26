import {IFolderRequestData} from "../file-directory/FileDirectoryTypes.ts";

export interface XFItemScheme {
    XsdSchema_ID: XFItem
    zipDATE: XFItem,
    Desc: XFItem,
    zipLastDate: XFItem,
    zipVERS: XFItem,
    zipLastUser: XFItem,
    IsStore: XFItem,
    zipOPER: XFItem,
    zipUSER: XFItem,
    Name: XFItem
}

export interface XFItemDocument {
    XsdSchema_ID: XFItem,
    XmlDocument_ID: XFItem,
    XsdSchema_Name: XFItem,
    zipDATE: XFItem,
    Desc: XFItem,
    zipLastDate: XFItem,
    zipVERS: XFItem,
    zipLastUser: XFItem,
    IsStore: XFItem,
    zipOPER: XFItem,
    zipUSER: XFItem,
    Name: XFItem
}

export interface XFItem {
    name: string,
    value: object
}


export interface RequestsXSDType {
    getSchemes: () => Promise<string | undefined>
    getSchema: () => Promise<string | undefined>
    updateSchema: () => Promise<string | undefined>
    removeSchema: () => Promise<string | undefined>
    getDocuments: () => Promise<string | undefined>
    getDocument: () => Promise<string | undefined>
    updateDocument: () => Promise<string | undefined>
    removeDocument: () => Promise<string | undefined>
    getHTMLForm: () => Promise<string | undefined>
    validateXMLDocument: () => Promise<string | undefined>
    checkSupporting: () => Promise<string | undefined>
}
