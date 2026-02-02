<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"
import { Tree } from "@/modules/tree/composables/use-tree"
import type { ITree, TypeTreeId } from "@/types"
import { useTable } from "@/modules/tree/composables/use-table";
import {
  AllCommunityModule,
  type ColDef,
  type GetDataPath,
  type GridReadyEvent,
  ModuleRegistry,
} from "ag-grid-community"
import {
  RowGroupingModule,
  TreeDataModule,
  RowNumbersModule,
} from "ag-grid-enterprise"
import { computed, onMounted, ref } from "vue";

ModuleRegistry.registerModules([
  AllCommunityModule,
  RowGroupingModule,
  RowNumbersModule,
  TreeDataModule,
]);

const props = defineProps<{
  items: ITree[]
}>()

const treeStore = new Tree(props.items)
const { colDefs, defaultColDef } = useTable()

const autoGroupColumnDef = computed<ColDef>(() => ({
  headerName: 'Категория',
  minWidth: 300,
  valueFormatter: (params) => `${treeStore.getChildren(params.value).length ? 'Группа' : 'Элемент'}`,
  cellClass: (params) => `${treeStore.getChildren(params.value).length ? 'cell-medium' : ''}`,
  cellRendererParams: {
    suppressCount: true,
  },
}))

const rowData = ref<ITree[] | null>(null)

const getDataPath: GetDataPath = (data: ITree): string[] => {
  const path: string[] = [];
  const parents = treeStore.getAllParents(data.id)

  for (let i = 0; i < parents.length; i++) {
    path.unshift(String(parents[i]!.id))
  }
  return path
}

const gridApi = ref()

function initializeRowData() {
  rowData.value = treeStore.getTreeDataForGrid()
}

onMounted(() => {
  initializeRowData()
})

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}

defineExpose({
  addItem: (item: ITree) => {
    treeStore.addItem(item)
    initializeRowData()
  },
  removeItem: (id: TypeTreeId) => {
    treeStore.removeItem(id)
    initializeRowData()
  },
  updateItem: (item: ITree) => {
    treeStore.updateItem(item)
    initializeRowData()
  },
})
</script>

<template>
  <AgGridVue
    :row-numbers="true"
    :row-data="rowData"
    :column-defs="colDefs"
    :tree-data="true"
    :default-col-def="defaultColDef"
    :get-data-path="getDataPath"
    :auto-group-column-def="autoGroupColumnDef"
    class="ag-grid-vue"
    @grid-ready="onGridReady"
  />
</template>

<style lang="sass">
.ag-grid-vue
  height: 100%

.cell-medium
  font-weight: 500
</style>
