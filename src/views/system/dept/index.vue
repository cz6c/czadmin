<template>
  <div class="page">
    <div class="search-wrap">
      <FormView
        ref="formView"
        v-model="tableSearch"
        :columns="2"
        labelWidth="126px"
        labelPosition="right"
        @sumbit="sumbit"
      />
    </div>
    <TableView
      ref="tableRef"
      :api="api"
      :columns="columns"
      :otherParams="formData"
      title="部门列表"
      tableHeight="calc(100% - 100px)"
    >
      <template #column-name="{ data }"> {{ data }} </template>
    </TableView>
  </div>
</template>
<script setup lang="ts" name="Dept">
import { ref, reactive } from "vue";
import { TableJsonItem } from "@/components/Table/index.d";
import { getDeptList } from "@/api/system";
import { FormJsonItem } from "@/components/Form/index.d";
import { useForm } from "@/components/Form/hooks/useForm";
import dayjs from "dayjs";

const api = getDeptList;
const columns: TableJsonItem[] = [
  {
    label: "deptName",
    prop: "deptName",
    columnType: "slot",
    slotName: "name",
  },
  {
    label: "orderNo",
    prop: "orderNo",
  },
  {
    label: "status",
    prop: "status",
    columnType: "switch",
    elProps: {
      activeText: "已启用",
      inactiveText: "已禁用",
    },
  },
  {
    label: "createTime",
    prop: "createTime",
    formatData: (data: number) => dayjs(data).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    label: "remark",
    prop: "remark",
  },
];
const tableRef: any = ref(null);
const tableSearch: FormJsonItem[] = reactive([
  {
    prop: "deptName",
    label: "deptName",
    data: "",
    initilaData: "",
  },
  {
    prop: "createTime",
    label: "createTime",
    data: "",
    initilaData: "",
    type: "date",
    elProps: {
      type: "date",
    },
  },
]);
const { formData } = useForm({ rawList: tableSearch });
const sumbit = () => {
  tableRef.value.getList();
};
</script>

<style lang="scss" scoped>
.page {
  height: 100%;

  .search-wrap {
    height: 80px;
    background-color: #fff;
    margin-bottom: 20px;
  }
}
</style>
