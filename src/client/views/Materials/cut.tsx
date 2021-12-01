import React from 'react';
import { Select, Button, Tabs } from 'antd';
import { materialStore } from '@/store/materialStore';

const Cut: React.FC = () => {
  const { handleCutSelectedLayer } = materialStore;

  return (
    <section className="material-cut">
      <p className="materil-cut-tips">在图层列表中选择层或组</p>
      <Button
        className="materil-cut-button"
        type="primary"
        shape="round"
        onClick={handleCutSelectedLayer}
      >
        标记为切图
      </Button>
    </section>
  );
};

export default Cut;
