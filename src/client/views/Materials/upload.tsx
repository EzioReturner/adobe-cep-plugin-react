import React, { useCallback, useEffect, useState } from 'react';
import { Select, Button, Tabs } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { materialStore } from '@/store/materialStore';
import png from '@assets/material/png.png';
import Cut from './cut';
// import psd from '@assets/material/psd.png';
import './upload.less';

const { TabPane } = Tabs;

const { Option } = Select;

const MaterialUpload: React.FC = () => {
  const { documents, activeDocument, handleChangeDocument, uploading, handleUpload } =
    materialStore;

  const Upload = (
    <section className="material-upload">
      <div className="upload-type">
        <div>
          <img src={png} alt="" />
          <span className="active">上传图片</span>
        </div>
        {/* <div className="divider"></div>
<div>
  <img src={psd} alt="" />
  <span>上传源文件</span>
</div> */}
      </div>

      <div className="form-row">
        <span className="form-label">当前设计:</span>
        <Select
          placeholder="请选择文件"
          className="material-select"
          value={activeDocument}
          dropdownMatchSelectWidth={false}
          onChange={e => handleChangeDocument(e.split('///')[0])}
        >
          {documents.map((d, index) => (
            <Option value={d + '///' + index} key={index}>
              {d}
            </Option>
          ))}
        </Select>
      </div>

      <div className="form-row">
        <span className="form-label">项目:</span>
        <Select placeholder="请选择项目" className="material-select"></Select>
      </div>

      {/* <Button onClick={importDoc}>importDoc</Button> */}

      <Button
        loading={uploading}
        style={{ width: '120px', marginTop: '24px' }}
        type="primary"
        onClick={handleUpload}
      >
        {uploading ? '上传中...' : '上传'}
      </Button>
    </section>
  );

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={<div className="tabs-item">上传</div>} key="1">
        {Upload}
      </TabPane>
      <TabPane tab={<div className="tabs-item">切图</div>} key="2">
        <Cut />
      </TabPane>
    </Tabs>
  );
};

export default observer(MaterialUpload);
