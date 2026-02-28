<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { redirect, verfyEmail } from '@/utils/auth'
import { Message } from '@arco-design/web-vue'
import { computed, ref } from 'vue'

defineEmits(['register'])

const email = ref('1716607668@qq.com')
const password = ref('12345678')
const loginDisabled = computed(() => {
  return password.value.length < 6 || !verfyEmail(email.value)
})
const userStore = useUserStore()

const handleLogin = () => {
  userStore
    .login({
      email: email.value,
      password: password.value,
    })
    .then(() => {
      Message.success({
        content: '登录成功！正在跳转...',
        duration: 3 * 1000,
      })
      redirect()
    })
}
</script>

<template>
  <a-space direction="vertical" size="large">
    <a-input size="large" v-model="email" :style="{ width: '320px' }" placeholder="请输入邮箱(1716607668@qq.com)"
      allow-clear>
      <template #prefix>
        <icon-user />
      </template>
    </a-input>
    <a-input-password size="large" v-model="password" :style="{ width: '320px' }" placeholder="请输入密码(12345678)"
      allow-clear>
      <template #prefix>
        <icon-lock />
      </template>
    </a-input-password>

    <div class="columns-2 gap-4">
      <div>
        <a-button class="w-full" @click="$emit('register')">注册</a-button>
      </div>
      <div>
        <a-button :disabled="loginDisabled" class="w-full" type="primary" @click="handleLogin">登录</a-button>
      </div>
    </div>
  </a-space>
</template>
