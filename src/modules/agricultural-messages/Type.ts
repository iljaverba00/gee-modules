
export interface Message{
    text: string,
    factId: string
    response: string,
    noResponse: boolean,
    loadResponse: boolean,
    messageTime: string,
    files: File[]
}

export interface File {
    docName: string
    docId: string
    folder: boolean
    fileDate: string
    url: string
  }

export interface Author{
    messages: Message[]
    label: string
    caption: string
    factId: string
}

export interface Record {
    count: number,
    id: string,
    data: RecorData
}

export interface RecorData{
    [key: string]: object | string | number | null | boolean | { epochSecond: number; nano: number };
}

export interface TreeNode {
    label: string,
    key: string,
    id: string,
    lazy: boolean,
    header: string
}

export interface LazyLoad{
    /**
     * The node to which the new nodes (the children) will be appended
     */
    node: TreeNode;
    /**
     * The key of the node getting the newly loaded child nodes
     */
    key: string;
    /**
     * The callback to be carried out when the loading is successful
     * @param children Array of nodes
     */
    done: (children?: readonly TreeNode[]) => void;
    /**
     * The callback to be carried out should the loading fails
     */
    fail: () => void;
}