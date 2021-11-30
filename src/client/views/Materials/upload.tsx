import React, { useCallback, useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { materialStore } from '@/store/materialStore';
import png from '@assets/material/png.png';
import psd from '@assets/material/psd.png';

import './upload.less';

const { Option } = Select;

const Upload: React.FC = () => {
  const {
    documents,
    activeDocument,
    handleChangeDocument,
    handleGetLayers,
    handleSavePng,
    handleCutSelectedLayer,
    getLayerById,
    handleMergeLayer
  } = materialStore;

  return (
    <section className="material-upload">
      <div className="upload-type">
        <div>
          <img src={png} alt="" />
          <span className="active">上传图片</span>
        </div>
        <div className="divider"></div>
        <div>
          <img src={psd} alt="" />
          <span>上传源文件</span>
        </div>
      </div>

      <Select
        placeholder="请选择文件"
        className="material-select"
        value={activeDocument}
        onChange={e => handleChangeDocument(e.split('///')[0])}
      >
        {documents.map((d, index) => (
          <Option value={d + '///' + index} key={index}>
            {d}
          </Option>
        ))}
      </Select>

      {/* <Button type="primary" onClick={handleGetLayers}>
        getLayers
      </Button>

      <Button onClick={handleSavePng}>savePng</Button> */}

      <Button onClick={handleCutSelectedLayer}>一键切图</Button>

      {/* <Button onClick={handleMergeLayer}>mergeLayer</Button>

      <Button onClick={getLayerById}>getLayerById</Button> */}
    </section>
  );
};

export default observer(Upload);
