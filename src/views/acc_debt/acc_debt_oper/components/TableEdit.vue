<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="工资" prop="salary">
        <el-input v-model.trim="form.salary" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="年龄" prop="age">
        <el-input v-model.trim="form.age" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model.trim="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="部门号" prop="deptid">
        <el-input v-model.trim="form.deptid" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit, SaveEmp, UpdateEmp } from '@/api/table'

  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          name: '',
          salary: '',
          age: '',
          email: '',
          deptid: '',
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
          salary: [{ required: true, trigger: 'blur', message: '请输入工资' }],
          age: [{ required: true, trigger: 'blur', message: '请输入年龄' }],
          email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
          deptid: [{ required: true, trigger: 'blur', message: '请输入部门' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title == '添加') {
              const { msg } = await SaveEmp(this.form)
              this.$baseMessage(msg, 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('refresh-data')
              this.form = this.$options.data().form
            } else {
              const { msg } = await UpdateEmp(this.form)
              this.$baseMessage(msg, 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('refresh-data')
              this.form = this.$options.data().form
            }
          } else {
            return false
          }
        })
      },

      update() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await UpdateEmp(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
    },
  }
</script>
