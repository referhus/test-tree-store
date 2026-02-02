export type TypeTreeId = string | number

export interface ITree {
  id: TypeTreeId
  parent: TypeTreeId | null
  label: string
  path?: TypeTreeId[]
}

