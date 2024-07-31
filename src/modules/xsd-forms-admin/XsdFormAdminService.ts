import {RequestsXSDType, XFCreate, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";
import {AxiosResponse} from "axios";

export default function (): RequestsXSDType {
    const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
        console.log('getSchemes')
        return []
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
        return undefined;
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
    const getHTMLForm = async (schId: object): Promise<string | undefined> => {
        console.log('getHTMLForm', schId)
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


// export default function (): RequestsXSDType {
//     const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
//         return [
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код",
//                     "value": 1
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1721646527,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1722145691,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "i.verba"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": true
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "i.verba"
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": "Тест"
//                 }
//             },
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код",
//                     "value": 6
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1722146293,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1722146388,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "i.verba"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": true
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "i.verba"
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": "interact_map_plan"
//                 }
//             },
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код",
//                     "value": 7
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1722164756,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1722226736,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "i.verba"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": true
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "i.verba"
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": "555"
//                 }
//             },
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код",
//                     "value": 10
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1722239566,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1722239566,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "v.bakulin"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": true
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "v.bakulin"
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": "Границы в Росреестр"
//                 }
//             }
//         ]
//     }
//
//     const getSchema = async (schId: object): Promise<string | undefined> => {
//         console.log('getSchema', schId)
//         return undefined;
//     }
//
//     const updateSchema = async (schId: object | undefined, sch: XFCreate): Promise<string | undefined> => {
//         console.log('updateSchema', schId,sch)
//         return undefined;
//     }
//
//     const removeSchema = async (schId: object): Promise<string | undefined> => {
//         console.log('removeSchema', schId)
//         return undefined
//     }
//     const getDocuments = async (schId: object): Promise<XFItemDocument[] | undefined> => {
//         console.log('removeSchema', schId)
//         return [
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код схемы",
//                     "value": 2
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1721664808,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1721664808,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "i.verba"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": false
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "i.verba"
//                 },
//                 "XsdSchema_Name": {
//                     "name": "Наименование схемы",
//                     "value": null
//                 },
//                 "XmlDocument_ID": {
//                     "name": "Код",
//                     "value": 9
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": null
//                 }
//             },
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код схемы",
//                     "value": 2
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1721663794,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1722008935,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "i.verba"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": true
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "i.verba"
//                 },
//                 "XsdSchema_Name": {
//                     "name": "Наименование схемы",
//                     "value": null
//                 },
//                 "XmlDocument_ID": {
//                     "name": "Код",
//                     "value": 1
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": null
//                 }
//             },
//             {
//                 "XsdSchema_ID": {
//                     "name": "Код схемы",
//                     "value": 2
//                 },
//                 "zipDATE": {
//                     "name": "Архивная дата изменения",
//                     "value": {
//                         "epochSecond": 1721664834,
//                         "nano": 0
//                     }
//                 },
//                 "Desc": {
//                     "name": "Описание",
//                     "value": null
//                 },
//                 "zipLastDate": {
//                     "name": "Дата последнего изменения",
//                     "value": {
//                         "epochSecond": 1722008986,
//                         "nano": 0
//                     }
//                 },
//                 "zipVERS": {
//                     "name": "Архивная версия",
//                     "value": null
//                 },
//                 "zipLastUser": {
//                     "name": "Оператор последнего изменения",
//                     "value": "i.verba"
//                 },
//                 "IsStore": {
//                     "name": "Файловые приложения",
//                     "value": true
//                 },
//                 "zipOPER": {
//                     "name": "Архивная операция",
//                     "value": 1
//                 },
//                 "zipUSER": {
//                     "name": "Оператор архивации",
//                     "value": "i.verba"
//                 },
//                 "XsdSchema_Name": {
//                     "name": "Наименование схемы",
//                     "value": null
//                 },
//                 "XmlDocument_ID": {
//                     "name": "Код",
//                     "value": 10
//                 },
//                 "Name": {
//                     "name": "Наименование",
//                     "value": null
//                 }
//             }
//         ];
//     }
//     const getDocument = async (docId: object): Promise<string | undefined> => {
//         console.log('getDocument', docId)
//         return undefined;
//     }
//     const updateDocument = async (schId: object | undefined, docId: object | undefined, doc: XFCreate): Promise<string | undefined> => {
//         console.log('updateDocument',schId,docId,doc)
//         return undefined;
//     }
//     const removeDocument = async (docId: object): Promise<string | undefined> => {
//         console.log('removeDocument', docId)
//         return undefined;
//     }
//     const getHTMLForm = async (schId: object): Promise<string | undefined> => {
//         console.log(schId)
//         return "<!DOCTYPE html>\n" +
//             "<html lang=\"en\">\n" +
//             "<head>\n" +
//             "    <meta charset=\"UTF-8\">\n" +
//             "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
//             "    <title>Пример HTML</title>\n" +
//             "</head>\n" +
//             "<body>\n" +
//             "    <h1>Заголовок</h1>\n" +
//             "    <p>Это пример HTML-кода.</p>\n" +
//             "    <p>Он содержит несколько параграфов и заголовок.</p>\n" +
//             "</body>\n" +
//             "</html>";
//     }
//     const validateXMLDocument = async (docId: object): Promise<string | undefined> => {
//         console.log('validateXMLDocument', docId)
//         return undefined;
//     }
//     const checkSupporting = async (): Promise<boolean | undefined> => {
//         console.log('checkSupporting')
//         return true;
//     }
//
//     return {
//         getSchemes,
//         getSchema,
//         updateSchema,
//         removeSchema,
//         getDocuments,
//         getDocument,
//         updateDocument,
//         removeDocument,
//         getHTMLForm,
//         validateXMLDocument,
//         checkSupporting
//     }
// }













