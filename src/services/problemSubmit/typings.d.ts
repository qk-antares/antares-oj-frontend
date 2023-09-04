declare namespace ProblemSubmit {
  type ProblemSubmitAdd = {
    language: string;
    code: string;
    problemId: number;
  }

  type ProblemSubmitQuery = {
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: "descend" | "ascend";
    problemId: number;
  }

  type SubmitSummary = {
    total: number;
    easyPass: number;
    easyTotal: number;
    mediumPass: number;
    mediumTotal: number;
    hardPass: number;
    hardTotal: number;

    submitCount: number;
    passCount: number;
  }

  type JudgeInfo = {
    message: string;
    pass: number;
    total: number;
    memory: number;
    time: number;
    status: string;
    input: string;
    output: string;
    expectedOutput: string;
  }

  type ProblemSubmit = {
    id: number;
    language: string;
    code: string;
    judgeInfo: JudgeInfo;
    status: number;
    problemId: number;
    userId: number;
    createTime: any;
    updateTime: any;
  }
}
