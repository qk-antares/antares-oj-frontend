import React, {useEffect, useState} from "react";
import {ClockCircleOutlined, CloseOutlined} from "@ant-design/icons";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {useModel, useNavigate} from "@@/exports";
import {getProblemSubmitVoById} from "@/services/problemSubmit/api";
import {Avatar, Button, Divider, Skeleton, Tag} from "antd";
import MdEditor from "md-editor-rt";
import moment from "moment";
import {
  Color,
  JUDGE_INFO_STATUS, languageLabel,
  SUBMIT_STATUS,
  submitStatusColor,
  submitStatusIcon,
  submitStatusText
} from "@/utils/constants";

type LogDetailProps = {
  targetSubmitId: number;
  logHeight: string;
  afterClose: ()=>void;
}

const LogDetail: React.FC<LogDetailProps> = ({targetSubmitId, logHeight, afterClose})=>{
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [problemSubmit, setProblemSubmit] = useState<ProblemSubmit.ProblemSubmit>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(targetSubmitId > 0){
      getProblemSubmitVoById(targetSubmitId).then(res => {
        if(res.code === 200){
          setLoading(false);
          setProblemSubmit(res.data);
        }
      })
    }
  }, [targetSubmitId]);

  const closeDetail = () => {
    //将搜索参数拼接到query上
    const params = new URLSearchParams({
      tab: urlSearchParams.get('tab') || 'content',
      targetSubmitId: '-1'
    });
    const pageNum = urlSearchParams.get("pageNum")
    if(pageNum){
      params.append("pageNum", pageNum)
    }
    navigate({
      search: `?${params.toString()}`,
    });
    afterClose();
  }

  const closeCss = useEmotionCss(()=>{
    return  {
      color: 'rgb(140,140,140)',
      cursor: 'pointer',
      ':hover': {
        color: 'black',
      }
    };
  })

  return (<div>
    <div style={{margin: '5px 16px'}}>
      <CloseOutlined className={closeCss} onClick={closeDetail}/>
      <Divider style={{margin: '5px 0 0 0'}}/>
    </div>
    <div style={{height: logHeight, overflow: 'scroll'}}>
      {
        !loading && problemSubmit ?
          <div style={{margin: '16px 20px'}}>
            <div style={{display: 'flex'}}>
              <Avatar size='large' src={currentUser?.avatar}/>
              <div style={{marginLeft: 4, flex: '1 1 auto'}}>
                <div style={{fontWeight: 600}}>{currentUser?.username}</div>
                <div style={{fontSize: 11, color: '#3c3c4399'}}>
                  {moment(new Date(problemSubmit?.createTime).toISOString()).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>

              <div style={{float: 'right'}}>
                <span style={{fontSize: 12, color: '#3c3c4399', marginRight: 16}}>
                  通过测试用例：
                  <span style={{fontSize: 16, color: 'black', fontWeight: 600}}>
                    {problemSubmit.judgeInfo.pass} / {problemSubmit.judgeInfo.total}
                  </span>
                </span>

                <Button
                  size='large'
                  type="text"
                  style={{color: submitStatusColor.get(problemSubmit.status), fontSize: 18, padding: '0 16px'}}
                  icon={submitStatusIcon.get(problemSubmit.status)}>
                  {submitStatusText.get(problemSubmit.status)}
                </Button>
              </div>
            </div>

            <div style={{marginTop: 16}}>
              <Tag style={{borderRadius: 16, padding: '0 12px'}} color="processing">{languageLabel.get(problemSubmit.language)}</Tag>
              {
                problemSubmit.judgeInfo.time &&
                <Tag icon={<ClockCircleOutlined/>} style={{borderRadius: 16, padding: '0 12px'}} color="processing">
                  {problemSubmit.judgeInfo.time} ms
                </Tag>
              }
              {
                problemSubmit.judgeInfo.memory &&
                <Tag icon={<ClockCircleOutlined/>} style={{borderRadius: 16, padding: '0 12px'}} color="processing">
                  {problemSubmit.judgeInfo.memory} ms
                </Tag>
              }
            </div>

            {
              problemSubmit.status === SUBMIT_STATUS.FAILED &&
              <div style={{marginTop: 16, borderRadius: 8, backgroundColor: '#000a2008', padding: 16, fontSize: 13, color: '#262626bf'}}>
                <div>错误信息</div>
                <Divider style={{margin: '4px 0'}}/>
                <div style={{color: Color.HARD}}>{problemSubmit.judgeInfo.message}</div>
                {
                  problemSubmit.judgeInfo.status === JUDGE_INFO_STATUS.WRONG_ANSWER &&
                  <div style={{marginTop: 16}}>
                    <div>最后执行输入</div>
                    <Divider style={{margin: '4px 0'}}/>
                    <div style={{color: 'black'}}>{problemSubmit.judgeInfo.input}</div>

                    <div style={{marginTop: 16}}>预期输出</div>
                    <Divider style={{margin: '4px 0'}}/>
                    <div style={{color: Color.EASY}}>{problemSubmit.judgeInfo.expectedOutput}</div>

                    <div style={{marginTop: 16}}>实际输出</div>
                    <Divider style={{margin: '4px 0'}}/>
                    <div style={{color: Color.HARD}}>{problemSubmit.judgeInfo.output}
                    </div>
                  </div>
                }
              </div>
            }

            <MdEditor previewOnly={true} modelValue={`\`\`\`\n${problemSubmit?.code}\n\`\`\`` || ''} editorId='log'/>
          </div> :
          <div style={{margin: '16px 20px'}}>
            <Skeleton paragraph={{rows: 10}}/>
          </div>
      }
    </div>
  </div>)
}

export default LogDetail
