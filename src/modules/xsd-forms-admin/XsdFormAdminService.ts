import {RequestsXSDType, XFCreateSchema, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

export default function (): RequestsXSDType {
    const getSchemes = async (): Promise<XFItemScheme[] | undefined> => {
        return [
            {
                "XsdSchema_ID": {
                    "name": "Код",
                    "value": 1
                },
                "zipDATE": {
                    "name": "Архивная дата изменения",
                    "value": {
                        "epochSecond": 1721646527,
                        "nano": 0
                    }
                },
                "Desc": {
                    "name": "Описание",
                    "value": null
                },
                "zipLastDate": {
                    "name": "Дата последнего изменения",
                    "value": {
                        "epochSecond": 1722145691,
                        "nano": 0
                    }
                },
                "zipVERS": {
                    "name": "Архивная версия",
                    "value": null
                },
                "zipLastUser": {
                    "name": "Оператор последнего изменения",
                    "value": "i.verba"
                },
                "IsStore": {
                    "name": "Файловые приложения",
                    "value": true
                },
                "zipOPER": {
                    "name": "Архивная операция",
                    "value": 1
                },
                "zipUSER": {
                    "name": "Оператор архивации",
                    "value": "i.verba"
                },
                "Name": {
                    "name": "Наименование",
                    "value": "Тест"
                }
            },
            {
                "XsdSchema_ID": {
                    "name": "Код",
                    "value": 6
                },
                "zipDATE": {
                    "name": "Архивная дата изменения",
                    "value": {
                        "epochSecond": 1722146293,
                        "nano": 0
                    }
                },
                "Desc": {
                    "name": "Описание",
                    "value": null
                },
                "zipLastDate": {
                    "name": "Дата последнего изменения",
                    "value": {
                        "epochSecond": 1722146388,
                        "nano": 0
                    }
                },
                "zipVERS": {
                    "name": "Архивная версия",
                    "value": null
                },
                "zipLastUser": {
                    "name": "Оператор последнего изменения",
                    "value": "i.verba"
                },
                "IsStore": {
                    "name": "Файловые приложения",
                    "value": true
                },
                "zipOPER": {
                    "name": "Архивная операция",
                    "value": 1
                },
                "zipUSER": {
                    "name": "Оператор архивации",
                    "value": "i.verba"
                },
                "Name": {
                    "name": "Наименование",
                    "value": "interact_map_plan"
                }
            },
            {
                "XsdSchema_ID": {
                    "name": "Код",
                    "value": 7
                },
                "zipDATE": {
                    "name": "Архивная дата изменения",
                    "value": {
                        "epochSecond": 1722164756,
                        "nano": 0
                    }
                },
                "Desc": {
                    "name": "Описание",
                    "value": null
                },
                "zipLastDate": {
                    "name": "Дата последнего изменения",
                    "value": {
                        "epochSecond": 1722164756,
                        "nano": 0
                    }
                },
                "zipVERS": {
                    "name": "Архивная версия",
                    "value": null
                },
                "zipLastUser": {
                    "name": "Оператор последнего изменения",
                    "value": "i.verba"
                },
                "IsStore": {
                    "name": "Файловые приложения",
                    "value": true
                },
                "zipOPER": {
                    "name": "Архивная операция",
                    "value": 1
                },
                "zipUSER": {
                    "name": "Оператор архивации",
                    "value": "i.verba"
                },
                "Name": {
                    "name": "Наименование",
                    "value": "555"
                }
            }
        ];
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
        return undefined;
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
