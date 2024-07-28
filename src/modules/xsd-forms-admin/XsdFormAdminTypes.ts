
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

export interface XFCreateSchema{
    name: string,
    file: File | undefined
}


export interface RequestsXSDType {
    getSchemes: () => Promise<XFItemScheme[] | undefined>
    getSchema: (schId: object) => Promise<string | undefined>
    updateSchema: (schId : object | undefined, sch: XFCreateSchema) => Promise<string | undefined>
    removeSchema: (schId: object) => Promise<string | undefined>
    getDocuments: (docId: object) => Promise<XFItemDocument[] | undefined>
    getDocument: (docId: object) => Promise<string | undefined>
    updateDocument: () => Promise<string | undefined>
    removeDocument: (docId: object) => Promise<string | undefined>
    getHTMLForm: (schId: object) => Promise<string | undefined>
    validateXMLDocument: (docId: object) => Promise<string | undefined>
    checkSupporting: () => Promise<boolean | undefined>
}
