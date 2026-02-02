import type { ITree, TypeTreeId } from "@/types";
import { getCycleError, getFoundIdError, getNotFoundError } from "@/utils/get-errors";

export class Tree {
  private readonly store: ITree[]
  private treeMap: Map<TypeTreeId, ITree>
  private childrenMap: Map<TypeTreeId, ITree[]>

  constructor(initial: ITree[]) {
    this.store = [...initial]
    this.treeMap = new Map()
    this.childrenMap = new Map()

    this.store.forEach((item: ITree) => {
      const itemId = String(item.id)
      this.treeMap.set(itemId, item)

      this.setChildrenMap(item)
    })
  }

  getAll(): ITree[] {
    return this.store
  }

  getItem(id: TypeTreeId): ITree | null {
    const item = this.treeMap.get(id)
    return item !== undefined ? item : null
  }

  getChildren(id: TypeTreeId): ITree[] {
    const children = this.childrenMap.get(id)

    return children ? [...children] : []
  }

  getAllChildren(id: TypeTreeId): ITree[] {
    const result: ITree[] = []
    const stack: ITree[] = this.getChildren(id)

    while (stack.length > 0) {
      const current: ITree | undefined = stack.pop()

      if (!current) return result

      result.push(current)

      const children = this.getChildren(current.id)
      stack.push(...children)
    }

    return result
  }

  getAllParents(id: TypeTreeId): ITree[] {
    const result: ITree[] = []

    let current = this.getItem(id)
    if (!current) {
      return result
    }

    result.push(current)

    while (current && current.parent) {
      const parent = this.getItem(current.parent)
      if (!parent) {
        break
      }
      result.push(parent)
      current = parent
    }

    return result
  }

  addItem(item: ITree): void | boolean {
    const itemId = item.id
    const parentId = item.parent

    if (this.treeMap.has(itemId)) {
      return getFoundIdError(itemId)
    }

    if (this.willCreateCycle(itemId, parentId)) {
      return getCycleError(itemId, parentId)
    }

    this.treeMap.set(itemId, item)
    this.rebuildChildrenMap()
  }

  removeItem(id: TypeTreeId): void | boolean {
    const item = this.getItem(id)

    if (item === undefined) {
      return getNotFoundError(id)
    }

    const allChildren = this.getAllChildren(id)

    const stack = [id, ...allChildren.map(c => c.id)]

    while (stack.length > 0) {
      const current = stack.pop()
      if (current)
        this.treeMap.delete(current)
    }

    this.rebuildChildrenMap()
  }

  updateItem(item: ITree): void | boolean {
    const itemId = item.id
    const parentId = item.parent

    if (!this.treeMap.has(itemId)) {
      return getNotFoundError(itemId)
    }

    if (this.willCreateCycle(itemId, parentId)) {
      return getCycleError(itemId, parentId)
    }

    const oldItem = this.treeMap.get(itemId)!

    const parentIdChanged = item.parent !== undefined &&
      item.parent !== oldItem.parent

    const newItem = {
      ...oldItem,
      ...item
    }

    this.treeMap.set(itemId, newItem)

    if (parentIdChanged) {
      this.rebuildChildrenMap()
    }
  }

  getTreeDataForGrid(): ITree[] {
    const result: ITree[] = []

    const processItems = (parentId?: TypeTreeId | null) => {
      const children = parentId !== null && parentId !== undefined
        ? this.getChildren(parentId)
        : this.getRootItems()

      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (!child) return

        const path = this.getPath(child.id)

        result.push({
          ...child,
          path
        });

        const childChildren = this.getChildren(child.id)
        if (childChildren.length > 0) {
          processItems(child.id)
        }
      }
    };

    processItems(null)
    return result
  }

  private getRootItems(): ITree[] {
    const rootItems: ITree[] = []

    this.treeMap.forEach((value) => {
      if (!value.parent) {
        rootItems.push(value)
      }
    })

    return rootItems
  }

  private getPath(id: TypeTreeId): string[] {
    const path: string[] = []
    let currentId: TypeTreeId = String(id)

    while (currentId !== undefined && currentId !== null) {
      const item = this.getItem(currentId)
      if (!item) break

      path.unshift(currentId)
      currentId = String(item.parent)
    }

    return path
  }

  private setChildrenMap(item: ITree): void {
    const parentId = item.parent
    if (!parentId)
      return

    let childrenArray = this.childrenMap.get(parentId)
    if (!childrenArray) {
      childrenArray = []
      this.childrenMap.set(parentId, childrenArray)
    }

    childrenArray.push(item)
  }

  private rebuildChildrenMap(): void {
    this.childrenMap.clear()

    this.treeMap.forEach(item => {
      this.setChildrenMap(item)
    })
  }

  private willCreateCycle(itemId: TypeTreeId, newParentId: TypeTreeId | null): boolean {
    if (itemId === newParentId) return true

    if (newParentId === null || newParentId === undefined) return false

    let currentId = newParentId
    while (currentId !== null && currentId !== undefined) {
      if (currentId === itemId) return true

      const parentItem = this.getItem(currentId)
      if (!parentItem || parentItem.parent === null) break

      currentId = parentItem.parent
    }

    return false
  }
}
