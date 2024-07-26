import {XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

export default function requests() {

    const getSchemes = async (): [XFItemScheme] => {
        return []
    }
    const getSchema = async () => {
        return "xsd"
    }
    const updateSchema = async (value) => {
        console.log('updateSchema', value)
    }
    const removeSchema = async () => {
        console.log('removeSchema')
    }
    const getDocuments = async (schId: number): XFItemDocument => {
        console.log(schId)
        return []
    }
    const getDocument = async () => {
        console.log('getDocument')
    }
    const updateDocument = async () => {
        console.log('updateDocument')
    }
    const removeDocument = async (docId: number) => {
        console.log('removeDocument', docId)
    }
    const getHTMLForm = async (id: number) => {
        console.log(id)
        return ''
    }
    const validateXMLDocument = async (docId: number) => {
        console.log('validateXMLDocument', docId)
    }
    const checkSupporting = async (): boolean => {
        console.log('checkSupporting')
        return true
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
