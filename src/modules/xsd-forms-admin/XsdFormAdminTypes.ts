
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

export interface XFCreate {
    name: string,
    file: File | undefined
}


export interface RequestsXSDType {
    getSchemes: () => Promise<XFItemScheme[] | undefined>
    getSchema: (schId: object) => Promise<string | undefined>
    updateSchema: (schId : object | undefined, sch: XFCreate) => Promise<string | undefined>
    removeSchema: (schId: object) => Promise<string | undefined>
    getDocuments: (schId: object) => Promise<XFItemDocument[] | undefined>
    getDocument: (docId: object) => Promise<string | undefined>
    updateDocument: (schId: object | undefined, docId: object | undefined, doc: XFCreate) => Promise<string | undefined>
    removeDocument: (docId: object) => Promise<string | undefined>
    getHTMLForm: (schId: object) => Promise<string | undefined>
    validateXMLDocument: (docId: object) => Promise<string | undefined>
    checkSupporting: () => Promise<boolean | undefined>
}
