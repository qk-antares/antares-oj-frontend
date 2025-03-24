<template>
  <div class="w-full h-screen flex justify-center items-center">
    <a-tabs size="large" :active-key="activeKey" class="w-[320px]" @change="
      key => {
        activeKey = key
      }
    ">
      <a-tab-pane key="1" title="验证码登录">
        <sms-login />
      </a-tab-pane>
      <a-tab-pane key="2" title="密码登录">
        <account-login @register="activeKey = '1'" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import AccountLogin from './components/AccountLogin.vue'
import SmsLogin from './components/SmsLogin.vue'

const activeKey: Ref<string | number> = ref('1')
</script>
