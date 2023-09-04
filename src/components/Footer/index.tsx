import {DefaultFooter} from '@ant-design/pro-components';
import React from 'react';
import {IconFont} from "@/utils";
import {history} from '@umijs/max';

const Footer: React.FC = () => {
  const defaultMessage = '流火开发社区';
  const currentYear = new Date().getFullYear();

  const whiteList: string[] = [
    '/problemset/*',
  ]
  const flag = whiteList.some((item) => {
    const regex = new RegExp('^' + item.replace('*', '.*') + '$');
    return regex.test(history.location.pathname)
  })

  if(flag){
    return null;
  }

  return (

      <DefaultFooter
        style={{
          background: 'none',
        }}
        copyright={`${currentYear} ${defaultMessage}`}
        links={[
          {
            key: 'gitee',
            title: <span style={{margin: '0 8px'}}><IconFont style={{fontSize: 16}} type='icon-gitee'/> 流火Antares</span>,
            href: 'https://gitee.com/liuhuo-antares',
            blankTarget: true,
          },
          {
            key: 'beian',
            title: <span>豫ICP备2022028525号-1</span>,
            href: 'https://beian.miit.gov.cn/',
            blankTarget: true,
          },
        ]}
      />
  );
};
export default Footer;
