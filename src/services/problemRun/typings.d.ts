declare namespace ProblemRun {
  type ProblemRunResult = {
    code: number;
    input: string;
    output: string;
  }

  type ProblemRunRequest = {
    code: string;
    input: string;
    language: string;
  }
}
