export interface ItemList {
  text?: string;
  value: string;
  createDate?: string;
  changeDate?: string;
  code?: string;
  changeOperator?: string;
}
export interface Info {
  text: string;
  value: ItemList;
  type: string;
  alias?: string;
}

export interface Data { 
  title: string,
  icon: string
}
export interface Field {
  subTitle: string | null,
  subData: SubData[] | SubDataAdd[]
}
interface SubDataBasic {
  text: string,
  value: {value: string},
  type: string,
}
export interface SubData extends SubDataBasic {
  alias?: string,
  subTitleAdditional?: string,
  subDataAdditional?: SubDataBasic[]
}
export interface SubDataAdd {
  text?: string,
  value?: {value: string},
  type?: string,
  alias?: string,
  subTitleAdditional?: string,
  subDataAdditional?: SubDataBasic[]
}
export const emptyItemValue: ItemList = {
  text: "",
  value: "",
  changeDate: "",
  changeOperator: "",
  code: "",
  createDate: "",
};
