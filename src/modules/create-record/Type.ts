interface ObjField {
    id: number;
    value: string;
    options?: {label:string, value:number}[]
}

export interface ObjGeometry {
    type?: string;
    centerWgs: [number, number];
    zoom: number;
    label: string;
    value: string;
}

export interface CreateObj {
    header?: string;
    subtitle?: string;
    tableAlias: string;
    fields: ObjField[];
    files?: {
        type: string;
        value: File | FileList | null | undefined;
    };
    geometry?: ObjGeometry;
}

export interface FactAttr {
    "id": number;
    "name": string;
    "alias": string;
    "type": number;
    "logicalType": number;
    "create": boolean;
    "edit": boolean;
    "clsFK": string | null;
    "searchOrder": number;
    "fkFields": string[] | null;
    "fkFieldsNames": string[] | null;
    "ftField": boolean;
    "unique": boolean;
}

export interface FactDescriptor {
    "id": number;
    "name": string;
    "table": string;
    "key": string;
    "innerType": number;
    "innerTypeField": string| null;
    "layerId": number;
    "create": boolean;
    "delete": boolean;
    "edit": boolean;
    "hasArchive": boolean;
    "viewArchive": boolean;
    "xFilesRead": boolean;
    "xFilesCreate": boolean;
    "xFilesEdit": boolean;
    "xFilesDelete": boolean;
    "annulOn": boolean;
    "annulOff": boolean;
    "attrs": FactAttr[];
}