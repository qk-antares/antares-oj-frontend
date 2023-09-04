import {CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined} from "@ant-design/icons";
import React from "react";

export const Color = {
    EASY: '#00AF9B',
    MEDIUM: '#FFB800',
    HARD: '#FF2D55'
}

//Content页面
export const problemStatusColor = new Map<string, string>([
    ['已通过', Color.EASY],
    ['尝试过', Color.MEDIUM],
    ['未开始', Color.HARD]
]);
export const problemStatusIcon = new Map<string, any>([
    ['已通过', <CheckCircleOutlined key='passed'/>],
    ['尝试过', <CloseCircleOutlined key='tried'/>],
    ['未开始', <MinusCircleOutlined key='noLog'/>]
])

//LogDetail页面
export const submitStatusText = new Map<number, string>([
    [3, "通过"],
    [2, "解答错误"],
    [1, "判题中"],
    [0, "等待中"]
]);

export const languageLabel = new Map<string, string>([
    ['java', 'Java'],
    ['cpp', 'C++'],
    ['javascript', 'JavaScript'],
    ['python', 'Python'],
])

export const submitStatusColor = new Map<number, string>([
    [3, Color.EASY],
    [2, Color.HARD],
    [1, Color.MEDIUM],
    [0, Color.MEDIUM],
]);

export const submitStatusIcon = new Map<number, any>([
    [3, <CheckCircleOutlined key='passed'/>],
    [2, <CloseCircleOutlined key='tried'/>],
    [1, <MinusCircleOutlined key='noLog'/>],
    [0, <MinusCircleOutlined key='noLog'/>]
])

export const SUBMIT_STATUS = {
    WAITING: 0,
    RUNNING: 1,
    FAILED: 2,
    SUCCEED: 3
}

export const JUDGE_INFO_STATUS = {
    ACCEPTED: "Accepted",
    WRONG_ANSWER: "Wrong Answer",
    COMPILE_ERROR: "Compile Error",
    MEMORY_LIMIT_EXCEEDED: "Out of Memory",
    TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
    PRESENTATION_ERROR: "Presentation Error",
    WAITING: "Waiting",
    OUTPUT_LIMIT_EXCEEDED: "Output Limit Exceeded",
    DANGEROUS_OPERATION: "Dangerous Operation",
    RUNTIME_ERROR: "Runtime Error",
    SYSTEM_ERROR: "System Error"
}
