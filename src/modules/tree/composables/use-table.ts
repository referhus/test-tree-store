import { computed, ref } from "vue";
import type { ColDef } from "ag-grid-community";

export function useTable() {
  const colDefs = computed<ColDef[]>(() => [
    {
      headerName: "Наименование",
      field: "label",
      width: 200,
      minWidth: 200,
      flex: 1,
    },
  ])

  const defaultColDef = ref<ColDef>({
    sortable: false,
    filter: false,
    resizable: true,
    editable: false,
  })

  return {
    colDefs,
    defaultColDef
  }
}
