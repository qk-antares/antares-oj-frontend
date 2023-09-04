import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Divider, message, Row, Skeleton, Space, Tabs, TabsProps} from "antd";
import 'md-editor-rt/lib/style.css';
import './index.less'
import Content from "@/pages/Problem/ProblemDetail/compontents/Content";
import Answer from "@/pages/Problem/ProblemDetail/compontents/Answer";
import SubmitLog from "@/pages/Problem/ProblemDetail/compontents/SubmitLog";
import Editor from "@/pages/Problem/ProblemDetail/compontents/Editor";
import {IconFont} from "@/utils";
import TextArea from "antd/es/input/TextArea";
import {useModel, useParams} from "@@/exports";
import {getSafeProblemById} from "@/services/problem/api";
import {history} from "@umijs/max";
import {doProblemSubmit} from "@/services/problemSubmit/api";
import {useNavigate} from "umi";
import LogDetail from "@/pages/Problem/ProblemDetail/compontents/LogDetail";
import {Color} from "@/utils/constants";
import {doProblemRun} from "@/services/problemRun/api";

const labelStyle: React.CSSProperties = {
  color: '#3c3c4399',
  fontSize: '.75rem',
  fontWeight: 500,
  marginBottom: 8
};

const cardStyle: React.CSSProperties = {
  borderRadius: '.5rem',
  backgroundColor: '#000a2008',
  padding: '6px 10px'
}

const ProblemDetail: React.FC = ()=>{
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const submitLogRef = useRef(null);

  const [activeTab, setActiveTab] = useState<string>(()=>{
    return urlSearchParams.get('tab') || 'content';
  })
  const [targetSubmitId, setTargetSubmitId] = useState<number>(()=>{
    return Number(urlSearchParams.get('targetSubmitId')) || -1;
  })

  const [activeTerminal, setActiveTerminal] = useState<string>('1')
  const [coderHeight, setCoderHeight] = useState<string>('100%');
  const [logHeight, setLogHeight] = useState<string>("calc(100vh - 180px)");
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);

  const [code, setCode] = useState('public class Main {\n\tpublic static void main(String[] args) {\n\t\t\n\t}\n}')

  const [language, setLanguage] = useState('java')

  const params = useParams();
  const problemId = Number(params.id);
  const [problem, setProblem] = useState<Problem.SafeProblem>();
  const [loading, setLoading] = useState<boolean>(true);
  const [difficultyColor, setDifficultyColor] = useState<string>('green');

  const [resultLoading, setResultLoading] = useState<boolean>(false);

  const [testInput, setTestInput] = useState<string>('');
  const [testResult, setTestResult] = useState<ProblemRun.ProblemRunResult>();
  const [testResultLoading, setTestResultLoading] = useState<boolean>(false);

  //左侧面板标签页
  const problemItems: TabsProps['items'] = [
    {
      key: 'content',
      label: `题目描述`,
    },
    {
      key: 'answer',
      label: `题解`,
    },
    {
      key: 'log',
      label: `提交记录`,
      disabled: !currentUser,
    },
  ];
  //控制台标签页
  const terminalItems: TabsProps['items'] = [
    {
      key: '1',
      label: `测试用例`,
    },
    {
      key: '2',
      label: `执行结果`,
    },
  ];

  //首先获取题目的全部信息，根据id查询题目信息
  useEffect(() => {
    getSafeProblemById(problemId).then(res => {
      if(res.code === 200){
        setProblem(res.data);
        setLoading(false);
        switch (res.data.difficulty){
          case '简单':
            setDifficultyColor(Color.EASY);break;
          case '中等':
            setDifficultyColor(Color.MEDIUM);break;
          case '困难':
            setDifficultyColor(Color.HARD);break;
        }
      } else {
        //文章不存在
        history.push('/');
      }
    })
  },[])

  //监听路径参数变化
  useEffect(() => {
    setActiveTab(urlSearchParams.get('tab') || 'content');
    setTargetSubmitId(Number(urlSearchParams.get('targetSubmitId')) || -1);
  }, [location.search]);

  //更新路径上的query参数
  const updateQuery = (newTab: string, submitId: number) => {
    //将搜索参数拼接到query上
    const params = new URLSearchParams({
      tab: newTab,
      targetSubmitId: submitId.toString()
    });
    navigate({
      search: `?${params.toString()}`,
    });
  }

  //切换tab时将query参数添加到路径上
  const changeTab = (newTab: string) => {
    updateQuery(newTab, targetSubmitId);
  }

  //当获取判题结果后将targetSubmitId设置到路径上
  const changeTargetSubmitId = (submitId: number) => {
    updateQuery(activeTab, submitId);
  }

  //点击运行按钮
  const runProblem = ()=>{
    setTestResultLoading(true);
    doProblemRun({code, language, input: testInput}).then(res => {
      if(res.code === 200){
        message.success("运行成功！");
        setActiveTerminal('2');
        setTestResult(res.data);
        setTestResultLoading(false);
      }
    })
  }

  //点击提交按钮
  const submitProblem = ()=>{
    if(problem){
      setResultLoading(true);
      doProblemSubmit({code, language, problemId: problem.id}).then(res => {
        console.log(res);
        //将搜索参数拼接到query上
        changeTargetSubmitId(res.data.id.toString());
        //如果当前在提交记录tab，要刷新
        if(activeTab === 'log' && submitLogRef.current){
          // @ts-ignore
          submitLogRef.current.reloadData();
        }
      })
    }
  }

  //获取控制台面板内容
  const getTerminalContent = () => {
    if(activeTerminal === '1'){
      return <>
        <div style={labelStyle}>输入</div>
        <TextArea
          value={testInput}
          onChange={(element)=>{
            setTestInput(element.target.value);
          }}
        />
      </>
    } else if (activeTerminal === '2') {
      return testResult ?
        <>
          <div style={labelStyle}>输入</div>
          <div style={cardStyle}>
            {testResult.input}
          </div>
          <div style={{marginTop: 16}}></div>
          <div style={labelStyle}>输出</div>
          <div style={cardStyle}>
            {testResult.output}
          </div>
        </> :
          testResultLoading ?
            <Skeleton paragraph={{rows: 4}}></Skeleton> :
            <div style={{color: '#3c3c4399',fontWeight: 500,justifyContent: 'center', height: '80px', display: 'flex', alignItems: 'center'}}>
              请先执行代码
            </div>
    }
  }

  //获取左侧标签页内容
  const getTabContent = () => {
    return (loading || !problem) ?
      <div style={{padding: '0 20px'}}><Skeleton paragraph={{rows: 10}}/></div> :
      activeTab === 'content' && <Content problem={problem} difficultyColor={difficultyColor}/> ||
      activeTab === 'answer' && <Answer answer={problem.answer}/> ||
      activeTab === 'log' && <SubmitLog ref={submitLogRef} problemId={problem.id}/>
  }

  //获取右侧面板内容
  const getRightPanelContent = () => {
    return targetSubmitId > 0 || resultLoading ?
      <LogDetail afterClose={()=>setResultLoading(false)} logHeight={logHeight} targetSubmitId={targetSubmitId}/> :
      <Editor coderHeight={coderHeight} code={code} setCode={setCode} language={language} setLanguage={setLanguage}/>
  }

  //点击控制台按钮
  const clickTerminal = ()=>{
    setTerminalOpen(!terminalOpen);
    if(terminalOpen){
      setCoderHeight('100%')
      setLogHeight('calc(100vh - 170px)')
    } else {
      setCoderHeight('calc(100vh - 322px)')
      setLogHeight('calc(100vh - 322px)')
    }
  }

  return (<Row style={{width: '100%', margin: '0 auto'}}>
    <Col span={12} style={{paddingRight: 4}}>
      <Card bodyStyle={{padding: 0}} style={{height: 'calc(100vh - 73px)', borderRadius: 4}}>
        <Tabs style={{padding: '0 16px'}} activeKey={activeTab} items={problemItems} onChange={changeTab} />
        {getTabContent()}
      </Card>
    </Col>

    <Col span={12} style={{paddingLeft: 4}}>
      <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 73px)'}}>
        <Card
          bodyStyle={{padding: 0, display: "flex", flexDirection: 'column', height: '100%'}}
          style={{flexGrow: 1, marginBottom: 8, borderRadius: 4}}
        >
          {getRightPanelContent()}
        </Card>

        <Card bodyStyle={{padding: 0}} style={{borderRadius: 4}}>
          {
            terminalOpen &&
            <div style={{position: 'relative', height: 150}}>
              <Tabs style={{padding: '0 16px'}} activeKey={activeTerminal} items={terminalItems} onChange={setActiveTerminal} />
              <div style={{maxHeight: 100, overflow: 'scroll'}}>
                <div style={{margin: '0 20px 10px 20px'}}>
                  {getTerminalContent()}
                </div>
              </div>

              <Divider style={{position: 'absolute', bottom: 0, margin: 0}}/>
            </div>
          }

          <div style={{padding: 8}}>
            <Button onClick={clickTerminal} type='text' size='small' style={{width: 90, height: 28}}>
              控制台 {terminalOpen ? <IconFont type='icon-down'/> : <IconFont type='icon-up'/>}
            </Button>

            <Space style={{float: 'right'}}>
              <Button
                disabled={!problem || !currentUser || targetSubmitId > 0}
                size='small'
                style={{width: 66, height: 28}}
                onClick={runProblem}>
                运行
              </Button>
              <Button
                disabled={!problem || !currentUser || targetSubmitId > 0}
                onClick={submitProblem}
                size='small'
                style={{width: 66, height: 28}}
                type='primary'>
                提交
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </Col>
  </Row>)
}

export default ProblemDetail
