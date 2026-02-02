<script setup lang="ts">
import TreeTable from "@/modules/tree/TreeTable.vue";
import type { ITree } from "@/types";
import { ref } from "vue";

const items: ITree[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' }
]

const treeTableRef = ref<InstanceType<typeof TreeTable> | null>(null)

// Операции с данными
const addRootItem = () => {
  const newItem: ITree = {
    id: 'dssdcsdcsd',
    parent: null,
    label: `Новый корневой элемент`
  };

  treeTableRef.value?.addItem(newItem)
};

const addChildItem = () => {
  const newId = `child_${Date.now()}`;
  const newItem: ITree = {
    id: newId,
    parent: 'dssdcsdcsd',
    label: `Дочерний элемент от`
  }

  treeTableRef.value?.addItem(newItem)
};

const removeItem = () => {
  treeTableRef.value?.removeItem('dssdcsdcsd');
};

const updateLabel = () => {
  treeTableRef.value?.updateItem({
    id: 'dssdcsdcsd',
    label: 'кавывывыв'
  } as ITree)
}
</script>

<template>
  <div class="block-item">
    <button @click="addRootItem">
      добавить корневой
    </button>
    <button @click="addChildItem">
      добавить дочерний
    </button>
    <button @click="updateLabel">
      изменить лейбл
    </button>
    <button @click="removeItem">
      удалить элемент
    </button>
    <TreeTable
      ref="treeTableRef"
      :items="items"
    />
  </div>
</template>

