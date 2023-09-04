import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, Tooltip} from "antd";
import {IconFont} from "@/utils";
import moment from "moment";
import {useNavigate} from "@@/exports";
import {listProblemSubmitVoByPage} from "@/services/problemSubmit/api";
import {Color, languageLabel} from "@/utils/constants";

type SubmitLogProps = {
  problemId: number;
  ref?: React.ForwardedRef<any>;
}

const SubmitLog: React.FC<SubmitLogProps> = forwardRef(({problemId}, ref)=>{
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  //搜索参数
  const targetSubmitId = Number(urlSearchParams.get('targetSubmitId')) || -1;
  const [pageNum, setPageNum] = useState(()=>{
      return Number(urlSearchParams.get('pageNum')) || 1;
  });

  const [dataSource, setDataSource] = useState<ProblemSubmit.ProblemSubmit[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  //重新获取数据
  const reloadData = ()=>{
    setLoading(true);
    listProblemSubmitVoByPage({
      pageNum: Number(urlSearchParams.get('pageNum')) || 1,
      problemId
    }).then(res => {
      if(res.code === 200){
        setDataSource(res.data.records);
        setTotal(res.data.total);
        setLoading(false);
      }
    })
  }

  // 将 reloadData 方法暴露给父组件
  useImperativeHandle(ref, () => ({
    reloadData
  }));

  //监听路径参数变化
  useEffect(() => {
    reloadData()
  }, [location.search]);

  //有关搜索参数
  const updateQueryParam = (pageNum: number, targetSubmitId: number) => {
    const params = new URLSearchParams({
      pageNum: pageNum.toString(),
      tab: 'log',
      targetSubmitId: targetSubmitId.toString()
    });
    //将搜索参数拼接到query上
    navigate({
      search: `?${params.toString()}`
    })
  }

  const clickInspect = (submitId: number) => {
    updateQueryParam(pageNum, submitId);
  }

  const changePage = (page: number) => {
    //将参数拼接到path上
    setPageNum(page);
    updateQueryParam(page, targetSubmitId);
  }

  const catalog = useEmotionCss(()=>{
    return {
      maxHeight: 'calc(100vh - 132px)',
      overflow: 'auto',
      '.title': {
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
      },
    }
  });

  const columns: ProColumns<ProblemSubmit.ProblemSubmit>[] = [
    {
      title: '状态',
      width: '15%',
      align: 'center',
      render: (_, problemSubmit) => (
        <>
          {
            problemSubmit.status === 0 && <span style={{color: Color.MEDIUM}}>等待中</span> ||
            problemSubmit.status === 1 && <span style={{color: Color.MEDIUM}}>判题中</span> ||
            problemSubmit.status === 2 && <span style={{color: Color.HARD}}>解答错误</span> ||
            problemSubmit.status === 3 && <span style={{color: Color.EASY}}>通过</span>
          }
        </>
      ),
    },
    {
      title: '语言',
      width: '15%',
      align: 'center',
      render: (_, problemSubmit) => (
        <>{languageLabel.get(problemSubmit.language)}</>
      ),
    },
    {
      title: '执行用时',
      width: '15%',
      align: 'center',
      render: (_, problemSubmit) => (
        <>{problemSubmit.judgeInfo.time ? `${problemSubmit.judgeInfo.time}ms` : 'N/A'}</>
      ),
    },
    {
      title: '消耗内存',
      width: '15%',
      align: 'center',
      render: (_, problemSubmit) => (
        <>{problemSubmit.judgeInfo.memory ? problemSubmit.judgeInfo.memory : 'N/A'}</>
      ),
    },
    {
      title: '时间',
      width: '30%',
      align: 'center',
      render: (_, problemSubmit) => {
        return <>
          {moment(new Date(problemSubmit.createTime).toISOString()).format('YYYY-MM-DD HH:mm:ss')}
        </>
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '10%',
      align: 'center',
      render: (dom, entity) => {
        return (<>
          <Tooltip placement="top" title="查看" color="#FA541C">
            <Button onClick={()=>clickInspect(entity.id)} type="text" icon={<IconFont type='icon-chakan'/>}></Button>
          </Tooltip>
        </>);
      },
    },
  ];

  return (<div className={catalog}>

    <ProTable<ProblemSubmit.ProblemSubmit>
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      search={false}
      options={false}
      pagination={{
        total: total,
        current: pageNum,
        pageSize: 10,
        onChange: changePage
      }}
    />
  </div>)
});

export default SubmitLog
