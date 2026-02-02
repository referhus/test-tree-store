import type { TypeTreeId } from "@/types";

export function getCycleError(itemId: TypeTreeId, parentId: TypeTreeId | null) {
  console.error(`Ошибка: Назначение родителя ${parentId} для элемента ${itemId} создаст циклическую зависимость`);
  return false
}

export function getNotFoundError(itemId: TypeTreeId) {
  console.warn(`Элемент с id=${itemId} не найден`)
  return false
}

export function getFoundIdError(itemId: TypeTreeId) {
  console.warn(`Элемент с id=${itemId} уже существует`)
  return false
}
