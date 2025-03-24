<script lang="ts" setup>
import { sendMailCode } from '@/api/user'
import { useUserStore } from '@/stores'
import { redirect, verfyEmail } from '@/utils/auth'
import { Message } from '@arco-design/web-vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const smsText = ref('获取验证码')
const countdown = ref(0)
const email = ref('')
const captcha = ref('')
let intervalId: number | undefined = undefined
const smsDisabled = computed(() => {
  return countdown.value > 0 || !verfyEmail(email.value)
})
const userStore = useUserStore()

const handleSmsCode = () => {
  sendMailCode(email.value).then(() => {
    Message.success({
      content: '验证码已发送！',
      duration: 3 * 1000,
    })
  })

  countdown.value = 60
  intervalId = setInterval(() => {
    countdown.value -= 1
    smsText.value = `重新发送(${countdown.value})`
    if (countdown.value === 0) {
      clearInterval(intervalId)
      smsText.value = '重新发送'
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const handleLogin = () => {
  userStore.loginByCode({
    email: email.value,
    captcha: captcha.value,
  }).then(redirect)
}
</script>

<template>
  <a-space direction="vertical" size="large">
    <a-input v-model="email" size="large" :style="{ width: '320px' }" placeholder="请输入邮箱" allow-clear>
      <template #prefix>
        <icon-user />
      </template>
    </a-input>

    <a-space size="medium" direction="horizontal">
      <a-input v-model="captcha" size="large" placeholder="请输入验证码" allow-clear>
        <template #prefix>
          <icon-lock />
        </template>
      </a-input>
      <a-button size="large" class="w-32" :disabled="smsDisabled" @click="handleSmsCode">{{ smsText }}</a-button>
    </a-space>

    <div>
      <a-button class="w-full" type="primary" @click="handleLogin">登录/注册</a-button>
    </div>
  </a-space>
</template>
