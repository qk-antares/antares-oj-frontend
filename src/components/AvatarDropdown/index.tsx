import {KeyOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {history, useModel} from '@umijs/max';
import {Col, Modal, Row, Spin, Typography} from 'antd';
import type {MenuInfo} from 'rc-menu/lib/interface';
import React, {useCallback, useState} from 'react';
import {flushSync} from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {outLogin} from "@/services/user/api";

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.username}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    history.push('http://blog.antares.cool/user/login');
  };
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { Paragraph } = Typography;

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      switch (key){
        case 'logout':
          flushSync(() => {
            setInitialState((s) => ({ ...s, currentUser: undefined }));
          });
          loginOut();
          break;
        case 'AK/SK':
          setModalVisible(true);
          break;
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuItems = currentUser ?
    [
      {
        key: "AK/SK",
        icon: <KeyOutlined/>,
        label: 'API密钥'
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出',
      }
    ] : [
      {
        key: 'login',
        icon: <UserOutlined />,
        label: '登录',
      },
      {
        key: 'register',
        icon: <SettingOutlined />,
        label: '注册',
      }
    ];

  return (<>
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>

    <Modal open={modalVisible} onCancel={()=>setModalVisible(false)} footer={null}>
      <Row style={{padding: '6px 0'}}>
        <Col style={{color: 'rgba(0,0,0,.4)'}} flex='80px'>
          AccessKey
        </Col>
        <Col flex='auto'>
          <Paragraph style={{color: 'rgba(0,0,0,.9)'}} copyable>{currentUser.accessKey}</Paragraph>
        </Col>
      </Row>

      <Row style={{padding: '6px 0'}}>
        <Col style={{color: 'rgba(0,0,0,.4)'}} flex='80px'>
          SecretKey
        </Col>
        <Col flex='auto'>
          <Paragraph style={{color: 'rgba(0,0,0,.9)'}} copyable>{currentUser.secretKey}</Paragraph>
        </Col>
      </Row>
    </Modal>
  </>);
};
