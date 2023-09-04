import React, {useEffect, useRef, useState} from "react";
import {Input, InputNumber, InputRef, message, Modal, Select, Space, Tag, Tooltip} from "antd";
import {ProForm, ProFormInstance} from "@ant-design/pro-form";
import {EditableProTable, ProColumns, ProFormText} from "@ant-design/pro-components";
import {PlusOutlined} from "@ant-design/icons";
import MdEditor from "md-editor-rt";
import 'md-editor-rt/lib/style.css';
import {createProblem, getProblemVoById, updateProblem} from "@/services/problem/api";
import {getUUID} from "rc-select/es/hooks/useId";

type CreateModalProps = {
  visible: boolean;
  onCancel: ()=>void;
  targetId: number;
  reloadData: ()=>void;
}

type JudgeCase = {
  id: string | number;
  input: string;
  output: string;
}

const columns: ProColumns<JudgeCase>[] = [
  {
    title: '输入用例',
    dataIndex: 'input',
    valueType: 'textarea',
    width: '40%',
  },
  {
    title: '输出用例',
    dataIndex: 'output',
    valueType: 'textarea',
    width: '40%',
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

const CreateUpdateModal: React.FC<CreateModalProps> = ({visible, targetId, onCancel, reloadData})=>{
  const formRef = useRef<ProFormInstance>();

  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const [difficulty, setDifficulty] = useState<string>('简单');

  const [content, setContent] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')

  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [timeLimit, setTimeLimit] = useState<number | null>(1000);
  const [memoryLimit, setMemoryLimit] = useState<number | null>(128);
  const [stackLimit, setStackLimit] = useState<number | null>(128);

  //清空输入
  const clearInput = ()=>{
    formRef.current?.setFieldValue('title', '');
    setTags([]);
    setDifficulty('简单');
    setContent('');
    setAnswer('');
    formRef.current?.setFieldValue("judgeCase", []);
    setEditableRowKeys([]);
    setTimeLimit(1000);
    setMemoryLimit(128);
    setStackLimit(128);
  }

  //有关targetId的
  useEffect(() => {
    if(targetId > 0){
      getProblemVoById(targetId).then(res => {
        if(res.code === 200){
          console.log(res.data);
          const problemVo: Problem.Problem = res.data;

          formRef.current?.setFieldValue('title',problemVo.title);
          setTags(problemVo.tags);
          setDifficulty(problemVo.difficulty);
          setContent(problemVo.content);
          setAnswer(problemVo.answer);

          const ids = Array.from({ length: problemVo.judgeCase.length }, () => getUUID());
          formRef.current?.setFieldValue('judgeCase', problemVo.judgeCase.map((item, index) => {
            return {
              id: ids[index],
              input: item.input,
              output: item.output,
            }
          }))
          setEditableRowKeys(ids);

          setTimeLimit(problemVo.judgeConfig.timeLimit);
          setMemoryLimit(problemVo.judgeConfig.memoryLimit);
          setStackLimit(problemVo.judgeConfig.stackLimit);
        }
      })
    }
  }, [targetId]);

  //创建或更新题目
  const createUpdateProblem = ()=>{
    const params = {
      title: formRef.current?.getFieldValue('title'),
      tags,
      difficulty,
      content,
      answer,
      judgeCase: formRef.current?.getFieldValue('judgeCase').map((item: JudgeCase) => {
        return {
          input: item.input,
          output: item.output,
        }
      }),
      judgeConfig: {
        timeLimit,
        memoryLimit,
        stackLimit,
      }
    };

    console.log(params);

    if(targetId === -1){
      createProblem(params).then(res => {
        if(res.code === 200){
          message.success('创建成功！');
          clearInput();
          onCancel();
          reloadData();
        }
      })
    } else {
      updateProblem({id: targetId, ...params}).then(res => {
        if(res.code === 200){
          message.success('更新成功！')
          clearInput();
          onCancel();
          reloadData();
        }
      })
    }

  }

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  //一些样式
  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top',
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    borderStyle: 'dashed',
  };

  return <Modal
    width={1000}
    maskClosable={false}
    open={visible}
    title={<div style={{fontWeight: 600,fontSize: 16, textAlign: 'center'}}>创建题目</div>}
    centered={true}
    onCancel={()=>{
      clearInput();
      onCancel();
    }}
    onOk={createUpdateProblem}
  >
    <div style={{maxHeight: 450, overflowY: 'scroll'}}>
      <ProForm<Problem.ProblemAdd>
        formRef={formRef}
        labelCol={{span: 2}}
        wrapperCol={{span: 22}}
        labelAlign='left'
        layout='horizontal'
        submitter={false}
      >
        <ProFormText name="title" label="标题" placeholder="请输入标题"/>

        <ProForm.Item label="标签" name="tags">
          <Space size={[0, 8]} wrap>
            <Space size={[0, 8]} wrap>
              {tags.map((tag, index) => {
                if (editInputIndex === index) {
                  return (
                    <Input
                      ref={editInputRef}
                      key={tag}
                      size="small"
                      style={tagInputStyle}
                      value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleEditInputConfirm}
                      onPressEnter={handleEditInputConfirm}
                    />
                  );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    key={tag}
                    closable={true}
                    style={{ userSelect: 'none' }}
                    onClose={() => handleClose(tag)}
                  >
        <span
          onDoubleClick={(e) => {
            if (index !== 0) {
              setEditInputIndex(index);
              setEditInputValue(tag);
              e.preventDefault();
            }
          }}
        >
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </span>
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag style={tagPlusStyle} onClick={showInput}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Space>
          </Space>
        </ProForm.Item>

        <ProForm.Item label="难度" name="difficulty">
          <Select
            size='small'
            value={difficulty}
            onChange={setDifficulty}
            style={{ width: 76}}
            options={[
              { value: '简单', label: '简单' },
              { value: '中等', label: '中等' },
              { value: '困难', label: '困难' },
            ]}
          />
        </ProForm.Item>

        <ProForm.Item label="题目描述" name="content">
          <MdEditor
            style={{height: 400}}
            modelValue={content}
            editorId='content'
            toolbarsExclude={['save','htmlPreview','github']}
            onChange={(newContent) => {setContent(newContent)}}
          />
        </ProForm.Item>

        <ProForm.Item label="题解" name="content">
          <MdEditor
            style={{height: 400}}
            modelValue={answer}
            editorId='answer'
            toolbarsExclude={['save','htmlPreview','github']}
            onChange={(newContent) => {setAnswer(newContent)}}
          />
        </ProForm.Item>

        <ProForm.Item
          label="测试用例"
          name="judgeCase"
          initialValue={[]}
          trigger="onValuesChange"
        >
          <EditableProTable<JudgeCase>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'top',
              record: () => ({
                id: getUUID(),
                input: '',
                output: ''
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>

        <ProForm.Item label="时间限制" name="timeLimit">
          <InputNumber addonAfter="ms" value={timeLimit} onChange={(value) => setTimeLimit(value)}/>
        </ProForm.Item>

        <ProForm.Item label="内存限制" name="memoryLimit">
          <InputNumber addonAfter="MB" value={memoryLimit} onChange={(value) => setMemoryLimit(value)}/>
        </ProForm.Item>

        <ProForm.Item label="堆栈限制" name="stackLimit">
          <InputNumber addonAfter="MB" value={stackLimit} onChange={(value) => setStackLimit(value)}/>
        </ProForm.Item>
      </ProForm>
    </div>
  </Modal>
}

export default CreateUpdateModal;

