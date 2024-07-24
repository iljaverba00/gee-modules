import { IFile } from '../../components/FilesList.vue';

export interface IGroup {
  name: string;
  alias: string;
  count: number;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IField {
  name: string;
  alias: string;
  id: number;
  value: number | string;
}

export interface IDocument {
  data: {
    name: string;
    recordId: number;
  };
  allField: IField[];
  files: IFile[] | null;
  loading: boolean;
}

export interface IDoc {
  doc: IDocument;
  parent?: IGroup;
}
