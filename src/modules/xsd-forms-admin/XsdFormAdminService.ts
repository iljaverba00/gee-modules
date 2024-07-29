import {RequestsXSDType, XFCreate, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

export default function (): RequestsXSDType {
    const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
        return []
    }

    const getSchema = async (schId: object): Promise<string | undefined> => {
        console.log('getSchema', schId)
        return undefined;
    }

    const updateSchema = async (schId: object | undefined, sch: XFCreate): Promise<string | undefined> => {
        console.log('updateSchema', schId,sch)
        return undefined;
    }

    const removeSchema = async (schId: object): Promise<string | undefined> => {
        console.log('removeSchema', schId)
        return undefined
    }
    const getDocuments = async (schId: object): Promise<XFItemDocument[] | undefined> => {
        console.log('removeSchema', schId)
        return undefined;
    }
    const getDocument = async (docId: object): Promise<string | undefined> => {
        console.log('getDocument', docId)
        return undefined;
    }
    const updateDocument = async (schId: object | undefined, docId: object, doc: XFCreate): Promise<string | undefined> => {
        console.log('updateDocument',schId,docId,doc)
        return undefined;
    }
    const removeDocument = async (docId: object): Promise<string | undefined> => {
        console.log('removeDocument', docId)
        return undefined;
    }
    const getHTMLForm = async (schId: object): Promise<string | undefined> => {
        console.log(schId)
        return undefined;
    }
    const validateXMLDocument = async (docId: object): Promise<string | undefined> => {
        console.log('validateXMLDocument', docId)
        return undefined;
    }
    const checkSupporting = async (): Promise<boolean | undefined> => {
        console.log('checkSupporting')
        return true;
    }

    return {
        getSchemes,
        getSchema,
        updateSchema,
        removeSchema,
        getDocuments,
        getDocument,
        updateDocument,
        removeDocument,
        getHTMLForm,
        validateXMLDocument,
        checkSupporting
    }
}
