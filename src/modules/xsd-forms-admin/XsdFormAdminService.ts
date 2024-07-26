import {RequestsXSDType, XFCreateSchema, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

export default function requests() {
    const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
        return undefined;
    }

    const getSchema = async (schId: object): Promise<string | undefined> => {
        console.log('getSchema',schId)
        return undefined;
    }

    const updateSchema = async (sch: XFCreateSchema): Promise<string | undefined> => {
        console.log('updateSchema',sch)
        return undefined;
    }

    const removeSchema = async (schId: object):Promise<string | undefined> => {
        console.log('removeSchema',schId)
        return undefined
    }
    const getDocuments = async (): Promise<XFItemDocument[]| undefined> => {
        return undefined;
    }
    const getDocument = async (docId: object):Promise<string | undefined>  => {
        console.log('getDocument',docId)
        return undefined;
    }
    const updateDocument = async ():Promise<string | undefined>  => {
        console.log('updateDocument')
        return undefined;
    }
    const removeDocument = async (docId: object):Promise<string | undefined>  => {
        console.log('removeDocument', docId)
        return undefined;
    }
    const getHTMLForm = async (id: object):Promise<string | undefined>  => {
        console.log(id)
        return undefined;
    }
    const validateXMLDocument = async (docId: object):Promise<string | undefined>  => {
        console.log('validateXMLDocument', docId)
        return undefined;
    }
    const checkSupporting = async (): Promise<boolean | undefined>  => {
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
    } as RequestsXSDType
}
