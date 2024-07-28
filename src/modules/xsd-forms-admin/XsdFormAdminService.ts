import {RequestsXSDType, XFCreateSchema, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

export default function (): RequestsXSDType {
    const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
        return undefined
        // return [
        //     {
        //         "XsdSchema_ID": {
        //             "name": "Код",
        //             "value": 1
        //         },
        //         "zipDATE": {
        //             "name": "Архивная дата изменения",
        //             "value": {
        //                 "epochSecond": 1721646527,
        //                 "nano": 0
        //             }
        //         },
        //         "Desc": {
        //             "name": "Описание",
        //             "value": null
        //         },
        //         "zipLastDate": {
        //             "name": "Дата последнего изменения",
        //             "value": {
        //                 "epochSecond": 1722145691,
        //                 "nano": 0
        //             }
        //         },
        //         "zipVERS": {
        //             "name": "Архивная версия",
        //             "value": null
        //         },
        //         "zipLastUser": {
        //             "name": "Оператор последнего изменения",
        //             "value": "i.verba"
        //         },
        //         "IsStore": {
        //             "name": "Файловые приложения",
        //             "value": true
        //         },
        //         "zipOPER": {
        //             "name": "Архивная операция",
        //             "value": 1
        //         },
        //         "zipUSER": {
        //             "name": "Оператор архивации",
        //             "value": "i.verba"
        //         },
        //         "Name": {
        //             "name": "Наименование",
        //             "value": "Тест"
        //         }
        //     },
        //     {
        //         "XsdSchema_ID": {
        //             "name": "Код",
        //             "value": 6
        //         },
        //         "zipDATE": {
        //             "name": "Архивная дата изменения",
        //             "value": {
        //                 "epochSecond": 1722146293,
        //                 "nano": 0
        //             }
        //         },
        //         "Desc": {
        //             "name": "Описание",
        //             "value": null
        //         },
        //         "zipLastDate": {
        //             "name": "Дата последнего изменения",
        //             "value": {
        //                 "epochSecond": 1722146388,
        //                 "nano": 0
        //             }
        //         },
        //         "zipVERS": {
        //             "name": "Архивная версия",
        //             "value": null
        //         },
        //         "zipLastUser": {
        //             "name": "Оператор последнего изменения",
        //             "value": "i.verba"
        //         },
        //         "IsStore": {
        //             "name": "Файловые приложения",
        //             "value": true
        //         },
        //         "zipOPER": {
        //             "name": "Архивная операция",
        //             "value": 1
        //         },
        //         "zipUSER": {
        //             "name": "Оператор архивации",
        //             "value": "i.verba"
        //         },
        //         "Name": {
        //             "name": "Наименование",
        //             "value": "interact_map_plan"
        //         }
        //     },
        //     {
        //         "XsdSchema_ID": {
        //             "name": "Код",
        //             "value": 7
        //         },
        //         "zipDATE": {
        //             "name": "Архивная дата изменения",
        //             "value": {
        //                 "epochSecond": 1722164756,
        //                 "nano": 0
        //             }
        //         },
        //         "Desc": {
        //             "name": "Описание",
        //             "value": null
        //         },
        //         "zipLastDate": {
        //             "name": "Дата последнего изменения",
        //             "value": {
        //                 "epochSecond": 1722164756,
        //                 "nano": 0
        //             }
        //         },
        //         "zipVERS": {
        //             "name": "Архивная версия",
        //             "value": null
        //         },
        //         "zipLastUser": {
        //             "name": "Оператор последнего изменения",
        //             "value": "i.verba"
        //         },
        //         "IsStore": {
        //             "name": "Файловые приложения",
        //             "value": true
        //         },
        //         "zipOPER": {
        //             "name": "Архивная операция",
        //             "value": 1
        //         },
        //         "zipUSER": {
        //             "name": "Оператор архивации",
        //             "value": "i.verba"
        //         },
        //         "Name": {
        //             "name": "Наименование",
        //             "value": "555"
        //         }
        //     }
        // ]
    }

    const getSchema = async (schId: object): Promise<string | undefined> => {
        console.log('getSchema', schId)
        return undefined;
    }

    const updateSchema = async (schId: object | undefined,sch: XFCreateSchema): Promise<string | undefined> => {
        console.log('updateSchema', schId,sch)
        return undefined;
    }

    const removeSchema = async (schId: object): Promise<string | undefined> => {
        console.log('removeSchema', schId)
        return undefined
    }
    const getDocuments = async (): Promise<XFItemDocument[] | undefined> => {
        return undefined
        // return [
        //     {
        //         "XsdSchema_ID": {
        //             "name": "Код схемы",
        //             "value": 2
        //         },
        //         "zipDATE": {
        //             "name": "Архивная дата изменения",
        //             "value": {
        //                 "epochSecond": 1721664834,
        //                 "nano": 0
        //             }
        //         },
        //         "Desc": {
        //             "name": "Описание",
        //             "value": null
        //         },
        //         "zipLastDate": {
        //             "name": "Дата последнего изменения",
        //             "value": {
        //                 "epochSecond": 1722008986,
        //                 "nano": 0
        //             }
        //         },
        //         "zipVERS": {
        //             "name": "Архивная версия",
        //             "value": null
        //         },
        //         "zipLastUser": {
        //             "name": "Оператор последнего изменения",
        //             "value": "i.verba"
        //         },
        //         "IsStore": {
        //             "name": "Файловые приложения",
        //             "value": true
        //         },
        //         "zipOPER": {
        //             "name": "Архивная операция",
        //             "value": 1
        //         },
        //         "zipUSER": {
        //             "name": "Оператор архивации",
        //             "value": "i.verba"
        //         },
        //         "XsdSchema_Name": {
        //             "name": "Наименование схемы",
        //             "value": null
        //         },
        //         "XmlDocument_ID": {
        //             "name": "Код",
        //             "value": 10
        //         },
        //         "Name": {
        //             "name": "Наименование",
        //             "value": null
        //         }
        //     },
        //     {
        //         "XsdSchema_ID": {
        //             "name": "Код схемы",
        //             "value": 2
        //         },
        //         "zipDATE": {
        //             "name": "Архивная дата изменения",
        //             "value": {
        //                 "epochSecond": 1721663794,
        //                 "nano": 0
        //             }
        //         },
        //         "Desc": {
        //             "name": "Описание",
        //             "value": null
        //         },
        //         "zipLastDate": {
        //             "name": "Дата последнего изменения",
        //             "value": {
        //                 "epochSecond": 1722008935,
        //                 "nano": 0
        //             }
        //         },
        //         "zipVERS": {
        //             "name": "Архивная версия",
        //             "value": null
        //         },
        //         "zipLastUser": {
        //             "name": "Оператор последнего изменения",
        //             "value": "i.verba"
        //         },
        //         "IsStore": {
        //             "name": "Файловые приложения",
        //             "value": true
        //         },
        //         "zipOPER": {
        //             "name": "Архивная операция",
        //             "value": 1
        //         },
        //         "zipUSER": {
        //             "name": "Оператор архивации",
        //             "value": "i.verba"
        //         },
        //         "XsdSchema_Name": {
        //             "name": "Наименование схемы",
        //             "value": null
        //         },
        //         "XmlDocument_ID": {
        //             "name": "Код",
        //             "value": 1
        //         },
        //         "Name": {
        //             "name": "Наименование",
        //             "value": null
        //         }
        //     },
        //     {
        //         "XsdSchema_ID": {
        //             "name": "Код схемы",
        //             "value": 2
        //         },
        //         "zipDATE": {
        //             "name": "Архивная дата изменения",
        //             "value": {
        //                 "epochSecond": 1721664808,
        //                 "nano": 0
        //             }
        //         },
        //         "Desc": {
        //             "name": "Описание",
        //             "value": null
        //         },
        //         "zipLastDate": {
        //             "name": "Дата последнего изменения",
        //             "value": {
        //                 "epochSecond": 1721664808,
        //                 "nano": 0
        //             }
        //         },
        //         "zipVERS": {
        //             "name": "Архивная версия",
        //             "value": null
        //         },
        //         "zipLastUser": {
        //             "name": "Оператор последнего изменения",
        //             "value": "i.verba"
        //         },
        //         "IsStore": {
        //             "name": "Файловые приложения",
        //             "value": false
        //         },
        //         "zipOPER": {
        //             "name": "Архивная операция",
        //             "value": 1
        //         },
        //         "zipUSER": {
        //             "name": "Оператор архивации",
        //             "value": "i.verba"
        //         },
        //         "XsdSchema_Name": {
        //             "name": "Наименование схемы",
        //             "value": null
        //         },
        //         "XmlDocument_ID": {
        //             "name": "Код",
        //             "value": 9
        //         },
        //         "Name": {
        //             "name": "Наименование",
        //             "value": null
        //         }
        //     }
        // ];
    }
    const getDocument = async (docId: object): Promise<string | undefined> => {
        console.log('getDocument', docId)
        return undefined;
    }
    const updateDocument = async (): Promise<string | undefined> => {
        console.log('updateDocument')
        return undefined;
    }
    const removeDocument = async (docId: object): Promise<string | undefined> => {
        console.log('removeDocument', docId)
        return undefined;
    }
    const getHTMLForm = async (id: object): Promise<string | undefined> => {
        console.log(id)
        return "<html>\n" +
            "<body>\n" +
            "\n" +
            "<p>This is a paragraph.</p>\n" +
            "<p>This is a paragraph.</p>\n" +
            "<p>This is a paragraph.</p>\n" +
            "\n" +
            "</body>\n" +
            "</html>\n";
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
