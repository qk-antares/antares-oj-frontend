import MdEditor from "md-editor-rt";
import React from "react";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {Button, Divider, Space, Statistic, Tag} from "antd";
import {LikeOutlined, StarOutlined} from "@ant-design/icons";
import {problemStatusColor, problemStatusIcon} from "@/utils/constants";

const green = 'rgb(2,176,156)';

type ContentProps = {
  problem: Problem.SafeProblem;
  difficultyColor: string;
}

const Content: React.FC<ContentProps> = ({problem, difficultyColor})=>{
  const catalog = useEmotionCss(()=>{
    return {
      padding: '0 20px',
      maxHeight: 'calc(100vh - 132px)',
      overflow: 'auto',
      '.title': {
        fontSize: '1.125rem',
        lineHeight: '1.75rem'
      },
    }
  });

  //一些css
  const statisticCss = useEmotionCss(()=>{
    return {
      display: 'flex',
      alignItems: 'center',
      ':hover': {
        cursor: 'pointer',
      },
      '.ant-statistic-title': {
        fontSize: 13,
        marginBottom: 0,
      }
    }
  })

  return (<div className={catalog}>
    <div className='title'>{problem?.title}</div>

    <Space size='small' style={{margin: '8px 0'}}>
      <span style={{color: difficultyColor, paddingRight: 8}}>
        {problem.difficulty}
      </span>

      <Button
        type="text"
        style={{color: problemStatusColor.get(problem.status)}}
        icon={problemStatusIcon.get(problem.status)}>
        {problem.status}
      </Button>

      <Button
        onClick={() => {}}
        type="text"
        style={{color: green}}
        icon={<LikeOutlined/>}
      >
        {problem.thumbNum.toString()}
      </Button>

      <Button
        onClick={() => {}}
        type="text"
        style={{color: green}}
        icon={<StarOutlined/>}
      >
        {problem.favourNum.toString()}
      </Button>
    </Space>

    <div>
      {problem.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
    </div>

    <Divider/>

    <div style={{marginTop: 12}}>
      <MdEditor previewOnly={true} modelValue={problem?.content || ''} editorId='content'/>
    </div>

    <Space size='large' style={{marginTop: 38, marginBottom: 12}}>
      <Statistic
        className={statisticCss}
        valueStyle={{ fontSize: 16, fontWeight: 500}}
        title="通过次数："
        value={problem.acceptedNum}
      />
      <Statistic
        className={statisticCss}
        valueStyle={{fontSize: 16, fontWeight: 500 }}
        title="提交次数："
        value={problem.submitNum}
      />
      <Statistic
        precision={2}
        suffix='%'
        className={statisticCss}
        valueStyle={{fontSize: 15, fontWeight: 500 }}
        title="通过率："
        value={100 * problem.acceptedNum / problem.submitNum || 0}
      />
    </Space>

    <div style={{marginTop: 38, marginBottom: 12, fontSize: 12, color: '#262626bf'}}>
      © 2023 流火Judge在线判题平台
    </div>
  </div>)
}

export default Content
