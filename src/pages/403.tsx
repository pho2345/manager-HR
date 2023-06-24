import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Trang không tồn tại!"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Trở về
      </Button>
    }
  />
);

export default NoFoundPage;
