export const ExecuteCodeStatusEnum = {
  TIMEOUT: { msg: '超出时间限制', value: 3 },
  RUN_FAILED: { msg: '执行出错', value: 2 },
  COMPILE_FAILED: { msg: '编译失败', value: 1 },
  SUCCESS: { msg: '成功', value: 0 },
}

export const JudgeInfoEnum = {
  SUCCESS: { msg: '通过', value: 0 },
  COMPILE_FAILED: { msg: '编译失败', value: 1 },
  RUN_FAILED: { msg: '执行出错', value: 2 },
  TIMEOUT: { msg: '超出时间限制', value: 3 },
  WRONG_ANSWER: { msg: '解答错误', value: 4 },
}

export const JudgeInfoEnumMap: Map<number, string> = new Map([
  [0, '通过'],
  [1, '编译失败'],
  [2, '执行出错'],
  [3, '超出时间限制'],
  [4, '解答错误'],
])

export const ProblemStatusEnum = {
  ALL: '全部',
  SOLVED: '已通过',
  TRIED: '尝试过',
  NOLOG: '未开始',
}
