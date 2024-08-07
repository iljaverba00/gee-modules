import {RequestsXSDType, XFCreate, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";
import {AxiosResponse} from "axios";

export default function (): RequestsXSDType {
    const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
        console.log('getSchemes')
        return [
            //             {
            //     "XsdSchema_ID": {
            //         "name": "Код",
            //         "value": 1
            //     },
            //     "zipDATE": {
            //         "name": "Архивная дата изменения",
            //         "value": {
            //             "epochSecond": 1721646527,
            //             "nano": 0
            //         }
            //     },
            //     "Desc": {
            //         "name": "Описание",
            //         "value": null
            //     },
            //     "zipLastDate": {
            //         "name": "Дата последнего изменения",
            //         "value": {
            //             "epochSecond": 1722145691,
            //             "nano": 0
            //         }
            //     },
            //     "zipVERS": {
            //         "name": "Архивная версия",
            //         "value": null
            //     },
            //     "zipLastUser": {
            //         "name": "Оператор последнего изменения",
            //         "value": "i.verba"
            //     },
            //     "IsStore": {
            //         "name": "Файловые приложения",
            //         "value": true
            //     },
            //     "zipOPER": {
            //         "name": "Архивная операция",
            //         "value": 1
            //     },
            //     "zipUSER": {
            //         "name": "Оператор архивации",
            //         "value": "i.verba"
            //     },
            //     "Name": {
            //         "name": "Наименование",
            //         "value": "Тест"
            //     }
            // },
        ]
    }

    const getSchema = async (schId: object): Promise<string | undefined> => {
        console.log('getSchema', schId)
        return undefined;
    }

    const updateSchema = async (schId: object | undefined, sch: XFCreate): Promise<string | undefined> => {
        console.log('updateSchema', schId, sch)
        return undefined;
    }

    const removeSchema = async (schId: object): Promise<string | undefined> => {
        console.log('removeSchema', schId)
        return undefined
    }
    const getDocuments = async (schId: object): Promise<XFItemDocument[] | undefined> => {
        console.log('getDocuments', schId)
        return [
            // {
            //     "XsdSchema_ID": {
            //         "name": "Код схемы",
            //         "value": 2
            //     },
            //     "zipDATE": {
            //         "name": "Архивная дата изменения",
            //         "value": {
            //             "epochSecond": 1721664834,
            //             "nano": 0
            //         }
            //     },
            //     "Desc": {
            //         "name": "Описание",
            //         "value": null
            //     },
            //     "zipLastDate": {
            //         "name": "Дата последнего изменения",
            //         "value": {
            //             "epochSecond": 1722008986,
            //             "nano": 0
            //         }
            //     },
            //     "zipVERS": {
            //         "name": "Архивная версия",
            //         "value": null
            //     },
            //     "zipLastUser": {
            //         "name": "Оператор последнего изменения",
            //         "value": "i.verba"
            //     },
            //     "IsStore": {
            //         "name": "Файловые приложения",
            //         "value": true
            //     },
            //     "zipOPER": {
            //         "name": "Архивная операция",
            //         "value": 1
            //     },
            //     "zipUSER": {
            //         "name": "Оператор архивации",
            //         "value": "i.verba"
            //     },
            //     "XsdSchema_Name": {
            //         "name": "Наименование схемы",
            //         "value": null
            //     },
            //     "XmlDocument_ID": {
            //         "name": "Код",
            //         "value": 10
            //     },
            //     "Name": {
            //         "name": "Наименование",
            //         "value": null
            //     }
            // }
        ];
    }
    const getDocument = async (docId: object): Promise<string | undefined> => {
        console.log('getDocument', docId)
        return undefined;
    }
    const updateDocument = async (schId: object | undefined, docId: object | undefined, doc: XFCreate): Promise<string | undefined> => {
        console.log('updateDocument', schId, docId, doc)
        return undefined;
    }
    const removeDocument = async (docId: object): Promise<string | undefined> => {
        console.log('removeDocument', docId)
        return undefined;
    }
    const getHTMLForm = async (schId: object, docId: object | undefined): Promise<string | undefined> => {
        console.log('getHTMLForm', schId, docId)
        return undefined;
    }
    const validateXML = async (schId: object, file: File): Promise<AxiosResponse | undefined> => {

        console.log('validateXML', schId, file)
        return undefined;
    }
    const validateXMLDocument = async (docId: object, schId: object): Promise<AxiosResponse | undefined> => {
        console.log('validateXMLDocument', docId, schId)
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
        validateXML,
        validateXMLDocument,
        checkSupporting
    }
}






