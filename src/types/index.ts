import type { GetDataPath } from "ag-grid-community";

export type TypeTreeId = string | number

export interface ITree {
  id: TypeTreeId
  parent: TypeTreeId | null
  label: string
  path?: TypeTreeId[]
}

export interface GetDataPathWithNumber<TData = any> extends GetDataPath<TData> {
  (data: TData): Array<string | number>;
}
