<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.name" placeholder="姓名" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-bottom-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
        <el-button type="primary" @click="testMessage">baseMessage</el-button>
        <el-button type="primary" @click="testALert">baseAlert</el-button>
        <el-button type="primary" @click="testConfirm">baseConfirm</el-button>
        <el-button type="primary" @click="testNotify">baseNotify</el-button>
      </vab-query-form-bottom-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      border
      highlight-current-row
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
      @refresh-data="fetchData"
    >
      <el-table-column
        show-overflow-tooltip
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="序号" width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="工资"
        prop="salary"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="年龄"
        prop="age"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="email"
        label="Email"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="deptid"
        label="所属部门"
      ></el-table-column>

      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <table-edit ref="edit" @refresh-data="fetchData"></table-edit>
  </div>
</template>

<script>
  import {
    getEmpAllPage,
    doDelete,
    getEmpByName,
    DeleteEmp,
    DeleteEmp_Batch,
  } from '@/api/table'
  import TableEdit from './components/TableEdit'
  //import {getEmpAllPage} from "../../../api/table";
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
          name: '',
        },
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      refreshData() {
        this.fetchData()
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            console.log('row data is' + row.id)
            const { msg } = await DeleteEmp({ id: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await DeleteEmp_Batch({ ids: ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        console.log('调用fetchData')
        this.listLoading = true
        //const { data, totalCount } = await getList(this.queryForm)
        //const { data, totalCount } = await getEmpAll(this.queryForm)
        if (this.queryForm.name != '') {
          const { data, totalCount } = await getEmpByName(
            this.queryForm.pageNo,
            this.queryForm.pageSize,
            this.queryForm.name
          )
          console.log(data)
          this.list = data
          const imageList = []
          data.forEach((item, index) => {
            imageList.push(item.img)
          })
          this.imageList = imageList
          this.total = totalCount
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        } else {
          const { data, totalCount } = await getEmpAllPage(
            this.queryForm.pageNo,
            this.queryForm.pageSize
          )
          console.log(data)
          this.list = data
          const imageList = []
          data.forEach((item, index) => {
            imageList.push(item.img)
          })
          this.imageList = imageList
          this.total = totalCount
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        }
      },
      testMessage() {
        this.$baseMessage('test1', 'success')
      },
      testALert() {
        this.$baseAlert('11')
        this.$baseAlert('11', '自定义标题', () => {
          /* 可以写回调; */
        })
        this.$baseAlert('11', null, () => {
          /* 可以写回调; */
        })
      },
      testConfirm() {
        this.$baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      },
      testNotify() {
        this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
      },
    },
  }
</script>
