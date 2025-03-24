## 流火Judge判题系统前端

### 1. 简介

#### 1.1 如何运行

1. 确保安装了`node`环境和`pnpm`包管理器（以下为我的版本）

   ```shell
   C:\Users\Antares>node -v
   v22.11.0

   C:\Users\Antares>pnpm -v
   9.14.4
   ```

2. 修改`src/config/config.tx`下的基本配置，需要将`BACKEND_URL`和`HOME_URL`分别修改为你的后端网关微服务地址和前端地址

   ```ts
   export const BACKEND_URL = 'http://dev.fffu.fun'
   export const HOME_URL = 'http://oj.fffu.fun'
   ```

3. 安装依赖并运行项目

   ```shell
   pnpm install

   pnpm start
   ```

---

#### 1.2 技术栈

本项目基本是在**Vue3原始的空白模板**基础上进行开发的，没有使用Ant Design Pro、Nuxt等很重的框架，确保项目的干净、简洁。

- vue3：基础框架
- pinia：状态管理（例如用户状态，题目状态）
- vue-router：动态路由匹配、嵌套路由、路由组件传参
- tailwindcss：样式
- axios：自定义响应拦截器，对异常统一处理
- arco-design：非常全的Vue组件库
- monaco-editor：代码编辑器
- vditor：Markdown编辑器
- mockjs：仅作示例使用
- loadash：工具库，使用了防抖debounce功能
- vite-plugin-vue-devtools：开发插件

---

#### 1.3 代码结构

```bash
├── api	# 和axios请求相关
│   ├── common
│   │   ├── interceptor.ts	# 配置请求的baseURL和响应拦截器
│   │   └── types.ts	# 定义通用的interface，例如响应R，分页请求PageReq
│   ├── problem	# 和题目相关的接口和类型定义
│   └── user	# 和用户相关的接口和类型定义
├── assets	# 放置了tailwindcss的index.css
├── components	# 项目通用的组件，例如Header、Footer、图标等
├── composables	# 组合式函数，例如useWindowSize用在Problem页面，根据窗口大小调整split的位置
├── config	# 一些项目常量的配置
├── layouts	# 两个布局
├── mock	# 用于在dev阶段前后端分离开发（给出了示例代码）
├── router	# 路由配置
├── stores	# pinia数据存储
│   ├── problem	# 存储题目信息，这主要是因为在题目界面有较为复杂的跨组件与嵌套的数据交互
│   └── user	# 存储用户信息
├── utils	# 工具类，例如使用IconFont
├── views	# 页面
│   ├── admin
│   ├── home
│   └── problem
├── App.vue
└── main.ts
```

---

#### 1.4 项目预览

---

### 2. 项目关键点笔记

#### 2.1 axios响应拦截器的实现

```ts
// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse<R>) => {
    const res = response.data
    if (res.code != 200) {
      Message.error({
        content: res.msg || 'Error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return response
  },
  error => {
    Message.error({
      content: error.response.data.msg || 'Request Error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)
```

关键点在于上面的这段代码。

> 当服务端返回的响应HTTP状态码不是200时（后端使用了全局异常处理器，理论上是不会出现HTTP状态码不为200的），进入到error这段代码。
>
> 一般来说，都是要根据响应中的data（这是后端自定义的响应类R）来做判断。如果data中响应码（我们自己定义的响应码）不为200，弹出错误框并返回Promise.reject()，正常的响应返回response。
>
> 其实一个更好的写法是返回response.data（返回我们自定义的那个响应R），但是由于TypeScript的类型校验问题，这里应该返回response。这意味着我们在正常的代码里使用响应时，要res.data.data来获取响应中的数据，前面的.data是为了获取自定义的响应R，后面的data是为了获取R中的数据

---

#### 2.2 动态Layout

考虑本项目的布局Layout，应该有3种：

- 对于登录/注册页，我们希望没有Header和Footer，仅展示Form表单（NoneLayout）

- 对于主页、管理页等普通的页面，我们希望用一个Header把路由展示出来，并用Footer展示一些网站的信息（DefaultLayout）

  ![image-20250111105708884](https://s2.loli.net/2025/01/11/VzxfOGmtPloYkjv.png)

- 对于做题页面，我们还要做单独的设计。做题页面的Header有【查看题目列表、上/下一题、运行、测试】等按钮，并且没有Footer（ProblemLayout），主体的部分也有一个固定的高度（100vh-header）

  ![image-20250111110009115](https://s2.loli.net/2025/01/11/IoZ5XaSvGiEtYgB.png)

通过**路由元信息（meta）**和**动态组件渲染（component）**来实现为不同路由应用不同的Layout（以下为示例）

为不同的路由配置元信息：

```ts
{
  path: '/problem/:problemId(\\d+)',
  name: 'problem',
  component: () => import('@/views/problem/ProblemView.vue'),
  props: route => ({
    problemId: Number(route.params.problemId),
  }),
  meta: {
    layout: 'problem',
  },
},
```

动态组件渲染：

```vue
<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CustomLayout from '@/layouts/ProblemLayout.vue'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const layout = computed(() => {
  switch (route.meta.layout) {
    case 'login':
      return NoneLayout
    case 'problem':
      return CustomLayout
    default:
      return DefaultLayout
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
```

---

#### 2.3 登录状态验证

为简化各页面组件的访问控制设计，项目的所有页面（除登录页）都要求用户登录后访问，所以需要在路由之前先判断用户的登录状态，可以利用Vue Router的全局路由守卫来实现：

```ts
// 设置全局路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 登录态为 true
  if (userStore.isLoggedIn) {
    if (to.name === 'login') {
      return next({ name: 'problemset' })
    }
    return next()
  }

  // 登录态为false，首先根据token刷新用户状态
  await userStore.refresh()
  // 后端验证登录
  if (userStore.isLoggedIn) {
    if (to.name === 'login') {
      return next({ name: 'problemset' })
    }
    return next()
  }

  // 确实没登录
  return next({ name: 'login' })
})
```

> 这里有两次if (userStore.isLoggedIn)判断，第一次直接取store中的isLoggedIn状态，这个更加快速（前提用户不是第一次进入页面）。由于store中的数据会在页面刷新或关闭后消失，在这种情况下还需要请求后端获取用户的状态（也即userStore.refresh），然后再判断用户是否登录

---

#### 2.3 新建和编辑页面的合并

考虑管理员的【新建题目】和【编辑题目】页面，这两个页面的结构基本相同，但是从页面的路由和数据上讲又有细微的差别。

- 路由层面：对于新建题目，它的路由可以是`/admin/problemset/add`；而对于编辑题目，它的路由应该形如`/admin/problemset/edit/{id}`。也就是说，对于编辑页面必须指定目标题目的`id`。
- 数据层面：对于新建题目，它的请求体是一个`ProblemAddReq`；而对于编辑题目，它的请求体是`ProblemUpdateReq`，注意这两个类型是不一样的，`ProblemUpdateReq`中必须指定题目`id`。

我们还是想使用一个组件来应对新建和编辑题目这两种操作。

对于路由，可以使用vue-router路由匹配语法中的可选参数，并通过路由向组件传参props。需要注意的是，路由传参默认是`string`类型的，所以我们还需要对`problemId`转换下（而不是简单地`props: true`）

```ts
{
  path: '/admin/problemset',
  name: 'adminProblemset',
  component: () => import('@/views/admin/AdminView.vue'),
  children: [
    {
      path: '/admin/problemset/:operation/:problemId(\\d+)?',
      name: 'adminProblem',
      component: () => import('@/views/admin/components/ProblemEditor.vue'),
      props: route => ({
        operation: route.params.operation,
        // 转换为 number
        problemId: route.params.problemId
          ? Number(route.params.problemId)
          : undefined,
      }),
    },
    //...
  ],
},
```

对于数据，可以用一个`ProblemAddReq`类型的`problem`，在具体发送请求时再根据当前的`operation`做判断往`problem`里添加属性：

```ts
const handleProblemUpdate = () => {
  updateProblem({
    ...toRaw(problem),
    id: problemId || 0,
    content: contentVditor.value!.getValue(),
    answer: answerVditor.value!.getValue(),
  }).then(() => {
    Message.success({
      content: '更新成功',
      duration: 3000,
    })
  })

  // 跳转到指定页面，例如问题列表页
  router.push({ name: 'adminProblemsetTable' }) // 假设在路由配置中定义了该路由名称
}
```

---

#### 2.4 做题页面的设计

##### 2.4.1 组合式函数获取窗口大小

做题页面的整体框架使用了`split`

```vue
<template>
  <!-- 50px是Header的高度 -->
  <div
    :style="{ height: 'calc(100vh - 50px)' }"
    class="bg-gray-100 pb-2 px-2 min-w-[820px]"
  >
    <a-split
      class="h-full w-full"
      direction="horizontal"
      min="0.3"
      max="0.7"
      default-size="0.5"
    >
      <template #first>
        <div class="w-full h-full pr-1">
          <problem-info-card v-if="problem" :problem="problem" />
        </div>
      </template>

      <template #second>
        <!-- 102px是Header的高度+底部padding+DebugCard的最小高度 -->
        <a-split
          direction="vertical"
          class="h-full pl-1"
          :min="0.15"
          :max="pageHeight - 102"
          :default-size="pageHeight - 102"
          v-model:size="height"
        >
          <template #first>
            <div class="w-full h-full pb-1">
              <code-card />
            </div>
          </template>
          <template #second>
            <div class="w-full h-full pt-1 overflow-hidden">
              <debug-card :fold="fold" @fold="changeFold" />
            </div>
          </template>
        </a-split>
      </template>
    </a-split>
  </div>
</template>
```

![image-20250113105642246](https://s2.loli.net/2025/01/13/PSyXpHd1B59QqVM.png)

这里的问题是，我们需要实时地获取页面的宽度和高度（主要是pageHeight），以对split的位置进行调整，否则如果用户的窗口先是很大（比如全屏），然后又缩小，某一个面板就有可能消失掉（尤其是折叠时比较小的debug面板）

我们可以把获取页面大小的这部分抽取成一个组合式函数，从而提升代码的复用性和清晰度：

```ts
import { onMounted, onUnmounted, ref } from 'vue'

export function useWindowSize() {
  const pageWidth = ref(window.innerWidth) // 页面宽度
  const pageHeight = ref(window.innerHeight) // 页面高度

  // 更新宽度和高度的方法
  const updateDimensions = () => {
    pageWidth.value = window.innerWidth
    pageHeight.value = window.innerHeight
  }

  // 监听窗口尺寸变化
  onMounted(() => {
    window.addEventListener('resize', updateDimensions)
  })

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  // 返回响应式的数据
  return {
    pageWidth,
    pageHeight,
  }
}
```

对split位置进行调整的代码如下。监听页面尺寸变化主要是防止debug面板消失，下面的changeFold是改变debug面板的折叠状态：

```ts
const { pageHeight } = useWindowSize()

// 监听页面尺寸变化
watch(pageHeight, newHeight => {
  height.value = `${Math.min(newHeight - 102, parseInt(height.value))}px`
})

const changeFold = () => {
  if (fold.value) {
    height.value = `${(pageHeight.value - 54) * 0.5}px`
  } else {
    height.value = `${pageHeight.value - 102}px`
  }
}
```

---

##### 2.4.2 problem状态管理

依然考虑题目页面，想象一下运行/提交的过程，我们点击**Header中的按钮**，之后将**题目id**、**编程语言**、**代码**、**测试用例**等信息提交到后端得到响应。

这里的问题是，**【控制按钮、数据】分布在不同层次的不同组件中**。例如Header中的按钮，这是一个最高层的`ProblemLayout`中的组件，题目id位于`ProblemView`中，编程语言位于`ProblemView/CodeCard/CodePanel/LangSelect`，代码位于`ProblemView/CodeCard/CodePanel/MonacoEditor`中，而测试用例同样位于细粒度的组件中（`ProblemView/DebugCard/CasePanel/CaseTabs`）。

这种错综复杂的关系导致通过props来实现非常的麻烦，代码的可读性也会大幅下降。因为本项目通过Pinia进行集中的problem状态管理，避免props层层传递，同时提高代码的可维护性和组件间的解耦。

Store的定义如下：

```ts
import type { ExecuteCodeReq, ExecuteCodeRes } from '@/api/problem/types'
import { defineStore } from 'pinia'

export const useProblemStore = defineStore('problem', {
  state: () => ({
    problemMap: new Map<number, { req: ExecuteCodeReq; res: ExecuteCodeRes }>(),
    // 没有使用activeId是考虑到用户可能打开多个做题页面，所以还是把id放到run和submit的参数中吧
    // activeId: -1,
  }),

  getters: {
    problemById: state => (id: number) => {
      return state.problemMap.get(id)
    },
  },

  actions: {
    addProblemIfNotExist(id: number, judgeCase: string[]) {
      if (!this.problemMap.has(id)) {
        this.problemMap.set(id, {
          req: {
            code: '',
            language: 'java',
            inputList: judgeCase,
          },
          res: {} as ExecuteCodeRes,
        })
        return true
      }
      return false
    },

    addTestCase(id: number, input: string) {
      this.problemById(id)?.req.inputList.push(input)
    },

    removeTestCase(id: number, index: number) {
      this.problemById(id)?.req.inputList.splice(index, 1)
    },

    setTestCase(id: number, index: number, input: string) {
      const targetProblem = this.problemById(id)
      if (targetProblem) {
        targetProblem.req.inputList[index] = input
      }
    },

    runCode(id: number) {
      console.log(this.problemById(id))
    },

    submitCode(id: number) {
      console.log(this.problemById(id))
    },
  },
})
```

以`MonacoEditor`组件为例，就可以直接使用和修改code了：

```ts
const problemStore = useProblemStore()
const activeProblem = computed(() => {
  return problemStore.problemMap.get(problemStore.activeId)
})

const editorContainer = ref<HTMLDivElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 初始化编辑器
onMounted(async () => {
  if (editorContainer.value) {
    //....

    editor.onDidChangeModelContent(() => {
      console.log('编辑器内容发生变化')
      if (activeProblem.value) {
        activeProblem.value.req.code = editor?.getValue() || ''
      }
    })
  }
})
```

---

##### 2.4.3 防抖机制

problem的有一个状态经常发生变化，也即用户编辑的代码code。在上一小节的实现中，我们在editor上绑定了一个事件回调`onDidChangeModelContent`，为了防止频繁修改problemStore，可以引入loadash的防抖函数

```ts
// 使用 lodash 的 debounce，延迟 500ms
const updateCode = debounce((newCode: string) => {
  if (activeProblem.value) {
    activeProblem.value.req.code = newCode
  }
}, 500)

editor.onDidChangeModelContent(() => {
  updateCode(editor?.getValue() || '') // 防抖调用
})
```
