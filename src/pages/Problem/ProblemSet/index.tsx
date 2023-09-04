import React, {useEffect, useState} from "react";
import {Card, Col, Row} from "antd";
import {useModel} from "@umijs/max";
import SafeProblemTable from "@/pages/Problem/ProblemSet/components/SafeProblemTable";
import * as echarts from 'echarts/core';
import {GraphicComponent, GraphicComponentOption} from 'echarts/components';
import {PieChart, PieSeriesOption} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {getSubmitSummary} from "@/services/problemSubmit/api";
import {Color} from "@/utils/constants";

echarts.use([GraphicComponent, PieChart, CanvasRenderer, LabelLayout]);

type EChartsOption = echarts.ComposeOption<
  GraphicComponentOption | PieSeriesOption
>;



const ProblemSet: React.FC = ()=>{
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [summary, setSummary] = useState<ProblemSubmit.SubmitSummary|null>(null);

  const getTotalByName = (name: string, data: ProblemSubmit.SubmitSummary) => {
    switch (name) {
      case '简单': return data.easyTotal;
      case '中等': return data.mediumTotal;
      case '困难': return data.hardTotal;
      case '未通过': return data.total;
    }
  }

  useEffect(() => {
    if(currentUser){
      getSubmitSummary().then(res => {
        if(res.code === 200){
          const data = res.data;
          setSummary(data)
          let chartDom = document.getElementById('main')!;
          let myChart = echarts.init(chartDom);
          let option: EChartsOption = {
            graphic: [
              {
                type: 'text',
                left: 'center', // 文本居中
                top: 'middle', // 文本居中
                style: {
                  text: [
                    '{name|全部}',
                    '{divider| }',
                    '{divider| }',
                    '{divider| }',
                    '{value|' + (data.easyPass+data.mediumPass+data.hardPass) + '}',
                    '{line|——————}',
                    '{divider| }',
                    '{total|' + data.total + '}'
                  ].join('\n'),
                  rich: {
                    name: {
                      align: 'center',
                      fontSize: 14,
                      fontWeight: 600,
                    },
                    value: {
                      align: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                    },
                    line: {
                      fontSize: 6,
                      fontWeight: 'bold'
                    },
                    divider: {
                      fontSize: 4
                    },
                    total: {
                      align: 'center',
                      fontSize: 14,
                      fontWeight: 600,
                    }
                  }
                },
              }
            ],
            color: [
              '#91cc75',
              '#fac858',
              '#ee6666',
              '#000a200d',
            ],
            series: [
              {
                type: 'pie',
                radius: ['75%', '90%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 2,
                  borderColor: '#fff',
                  borderWidth: 1
                },
                label: {
                  show: false,
                  position: 'center',
                  formatter: function (params) {
                    return [
                      '{name|' + params.name + '\n}',
                      '{divider|\n}',
                      '{value|' + params.value + '}',
                      '——————',
                      '{divider|\n}',
                      '{total|' + getTotalByName(params.name, data) + '}'
                    ].join('\n');
                  },
                  rich: {
                    name: {
                      fontSize: 14,
                      fontWeight: 600,
                    },
                    value: {
                      fontSize: 20,
                      fontWeight: 700,
                      color: Color.EASY,
                    },
                    divider: {
                      fontSize: 0
                    },
                    total: {
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#3c3c434d',
                    }
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 6,
                    fontWeight: 'bold'
                  }
                },
                data: [
                  { value: data.easyPass, name: '简单'},
                  { value: data.mediumPass, name: '中等'},
                  { value: data.hardPass, name: '困难'},
                  { value: data.total-data.easyPass-data.mediumPass-data.hardPass, name: '未通过'},
                ]
              }
            ]
          };

          myChart.setOption(option);

          myChart.on('mouseover', function(params) {
              if (params.seriesType === 'pie' && params.dataIndex !== undefined) {
                // 当 hover 到环图时，将 graphic 第一个元素设置为不可见
                // @ts-ignore
                option.graphic[0].invisible = true;
                myChart.setOption(option);
              }
          });

          myChart.on('mouseout', function(params) {
              if (params.seriesType === 'pie' && params.dataIndex !== undefined) {
                // 当鼠标移出环图时，将 graphic 第一个元素设置为可见
                // @ts-ignore
                option.graphic[0].invisible = false;
                myChart.setOption(option);
              }
          });
        }
      }).then()
    }
  }, []);

  return (<Row>
    <Col span={17} style={{paddingRight: 8}}>
      <SafeProblemTable/>
    </Col>

    <Col span={7}>
      <Card title='当前进度' style={{borderRadius: 4}} bodyStyle={{padding: 16}}>
        <Row justify="space-around" align="middle">
          <Col span={10}>
            <div style={{ width: '100%', height: 139}} id='main'></div>
          </Col>

          <Col span={14}>
            <Row>
              <Col span={8} style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.45)'}}>通过数</div>
                <div style={{fontSize: 18, fontWeight: 'bold', marginTop: 8}}>{summary?.submitCount}</div>
              </Col>
              <Col span={8} style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.45)'}}>提交数</div>
                <div style={{fontSize: 18, fontWeight: 'bold', marginTop: 8}}>{summary?.passCount}</div>
              </Col>
              <Col span={8} style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <div style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.45)'}}>通过率</div>
                <div style={{fontSize: 18, fontWeight: 'bold', marginTop: 8}}>
                  {(summary?.passCount || summary?.submitCount ?
                      (summary?.passCount / summary?.submitCount) * 100 : 0)
                      .toFixed(2)}%
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>)
}

export default ProblemSet
