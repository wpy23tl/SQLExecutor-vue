<template>
  <div class="sql-executor-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">多数据源 SQL 同步执行工具</span>
          <el-tag type="warning" effect="dark">高危操作，请谨慎执行</el-tag>
        </div>
      </template>

      <!-- 提示信息 -->
      <el-alert
        title="操作须知：此操作将同时在 3 个生产/测试数据库中执行，请确保 SQL 语句准确无误且包含分号结尾。"
        type="info"
        show-icon
        :closable="false"
        class="mb-20"
      />

      <!-- SQL 输入区域 -->
      <el-form :model="form" label-position="top">
        <el-form-item label="请输入 DDL / DML 语句">
          <el-input
            v-model="form.sqlContent"
            type="textarea"
            :rows="8"
            placeholder="例如：ALTER TABLE users ADD COLUMN age INT COMMENT '年龄';"
            resize="none"
            class="sql-input"
          />
        </el-form-item>

        <!-- 操作按钮区 -->
        <div class="action-area">
          <el-button @click="resetForm">清空</el-button>
          <el-popconfirm
            width="220"
            confirm-button-text="确定执行"
            cancel-button-text="取消"
            icon="el-icon-warning"
            icon-color="#F56C6C"
            title="确定要向所有数据源发送此 SQL 吗？"
            @confirm="handleExecute"
          >
            <template #reference>
              <el-button type="primary" :loading="loading" :disabled="!form.sqlContent">
                立即执行
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-form>
    </el-card>

    <!-- 执行结果反馈区域 -->
    <el-card class="box-card mt-20" v-if="executionLogs.length > 0">
      <template #header>
        <div class="card-header">
          <span>执行日志</span>
          <el-button type="text" @click="executionLogs = []">清除日志</el-button>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in executionLogs"
          :key="index"
          :type="log.status === 'success' ? 'success' : 'danger'"
          :timestamp="log.timestamp"
          placement="top"
        >
          <el-card>
            <h4>{{ log.dbName }} ({{ log.ip }})</h4>
            <p>执行结果: 
              <el-tag :type="log.status === 'success' ? 'success' : 'danger'">
                {{ log.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </p>
            <p v-if="log.message" class="error-msg">{{ log.message }}</p>
            <p class="sql-text">执行语句: {{ log.sql }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios' // 假设你使用了axios

// 表单数据
const form = reactive({
  sqlContent: ''
})

const loading = ref(false)
const executionLogs = ref([])

// 清空输入
const resetForm = () => {
  form.sqlContent = ''
}

// 执行逻辑
const handleExecute = async () => {
  if (!form.sqlContent.trim()) {
    ElMessage.warning('请输入SQL语句')
    return
  }

  loading.value = true
  
  // 模拟后端接口调用，请替换为您真实的接口地址
  // 假设后端返回结构为: 
  // { code: 200, data: [ { dbName: '库1', ip: '192.168.1.1', status: 'success', msg: 'OK' }, ... ] }
  try {
    // 这里替换为您的真实后端接口 API
    // const res = await axios.post('/api/sql/execute-multi', { sql: form.sqlContent })
    
    // --- 模拟数据开始 (联调时请删除) ---
    await new Promise(resolve => setTimeout(resolve, 1000))
    const mockResponse = [
      { dbName: 'Master_DB', ip: '192.168.1.101', status: 'success', msg: 'Affected rows: 1' },
      { dbName: 'Slave_DB_1', ip: '192.168.1.102', status: 'success', msg: 'Affected rows: 1' },
      { dbName: 'Slave_DB_2', ip: '192.168.1.103', status: 'error', msg: 'Syntax error near...' } // 模拟一个失败
    ]
    // --- 模拟数据结束 ---

    // 处理返回结果
    const currentTimestamp = new Date().toLocaleString()
    
    // 将后端返回的结果格式化并加入日志列表
    mockResponse.forEach(item => {
      executionLogs.value.unshift({
        dbName: item.dbName,
        ip: item.ip,
        status: item.status, // 'success' or 'error'
        message: item.msg,
        sql: form.sqlContent,
        timestamp: currentTimestamp
      })
    })

    ElMessage.success('执行请求已发送，请查看下方详细结果')

  } catch (error) {
    console.error(error)
    ElMessage.error('请求发送失败，请检查网络或后端服务')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sql-executor-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-weight: bold;
  font-size: 18px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

/* 优化输入框字体，使其看起来像代码 */
.sql-input :deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', monospace;
  background-color: #fafafa;
  color: #333;
  line-height: 1.5;
  font-size: 14px;
}

.action-area {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.error-msg {
  color: #F56C6C;
  font-size: 13px;
  margin-top: 5px;
  background: #fef0f0;
  padding: 5px;
  border-radius: 4px;
}

.sql-text {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
  font-family: monospace;
  white-space: pre-wrap; /* 保留换行 */
}
</style>
