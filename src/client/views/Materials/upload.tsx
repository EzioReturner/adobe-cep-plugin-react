import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Select, Button, Tabs, message, Input, Radio, Empty, Spin, Checkbox } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { materialStore } from '@/store/materialStore';
import { userStore } from '@store/userStore';
import png from '@assets/material/png.png';
import Cut from './Cut';
import SimulateRequest from '../SimulateRequest';
import Debug from '../Debug';
// import psd from '@assets/material/psd.png';
import Highlight from '@/components/Highlight';
import classnames from 'classnames';
import './upload.less';

const { TabPane } = Tabs;

const { Option } = Select;

interface AdvancedConfig {
  sizeHeight: number;
  sizeWidth: number;
  blankTop: number;
  blankBottom: number;
}

const MaterialUpload: React.FC = () => {
  const {
    documents,
    activeDocument,
    handleChangeDocument,
    uploading,
    handleUpload,
    loadMaterialList,
    materialList,
    setSelectedMaterial,
    selectedMaterial,
    loadingList
  } = materialStore;

  const [searchVal, setSearchVal] = useState('');

  const [advancedSetting, setAdvancedSetting] = useState(false);

  const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfig>({
    sizeHeight: 3000,
    sizeWidth: 3000,
    blankTop: 200,
    blankBottom: 200
  });

  useEffect(() => {
    loadMaterialList();
  }, [loadMaterialList]);

  const disabledUpload = useMemo(() => {
    return (
      !activeDocument ||
      !selectedMaterial ||
      Object.keys(advancedConfig).some(key => !advancedConfig[key as keyof AdvancedConfig])
    );
  }, [activeDocument, selectedMaterial, advancedConfig]);

  const UploadButton = (
    <Button
      loading={uploading}
      type="primary"
      shape="round"
      onClick={handleUpload}
      disabled={disabledUpload}
      className="upload-dispatch-button"
    >
      {uploading ? '上传中...' : '上传'}
    </Button>
  );

  const AdvancedCheckbox = (
    <Checkbox
      className="advanced-setting-checkbox"
      checked={advancedSetting}
      onChange={e => setAdvancedSetting(e.target.checked)}
    >
      高级设置
    </Checkbox>
  );

  const AdvancedInput = (type: keyof AdvancedConfig) => (
    <Input
      value={advancedConfig[type]}
      placeholder="请输入"
      size="small"
      style={{ width: 72 }}
      onChange={e =>
        setAdvancedConfig({
          ...advancedConfig,
          [type]: Number(e.target.value.replace(/[^\d]/g, ''))
        })
      }
    />
  );

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
          placeholder="请选择当前设计"
          disabled={documents.length === 0}
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
        <span className="form-label">文件夹:</span>
        <Select disabled defaultValue={1} placeholder="请选择文件夹" className="material-select">
          <Option value={1}>商品素材管理</Option>
        </Select>
      </div>

      <div className="form-row">
        <span className="form-label">文件名:</span>
        <Select
          placeholder="请选择文件"
          className="material-select"
          showSearch
          value={selectedMaterial}
          notFoundContent={
            loadingList ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
          onSearch={val => setSearchVal(val)}
          onChange={val => setSelectedMaterial(val)}
          filterOption={(input, option: any) => {
            if (typeof option.children === 'object') {
              return option.children.props.val.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            } else {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }
          }}
        >
          {materialList.map(l => (
            <Option value={l.id} key={l.id}>
              <Highlight val={l.name} tarVal={searchVal} />
            </Option>
          ))}
        </Select>
      </div>

      <div
        className={classnames(
          'form-row',
          advancedSetting ? 'use-advanced-setting' : 'no-advanced-setting'
        )}
      >
        {AdvancedCheckbox}
        {advancedSetting && (
          <div className="advanced-setting">
            <div className="advanced-setting-row">
              <span>画布尺寸:</span>
              <div>
                {AdvancedInput('sizeWidth')}
                <span style={{ lineHeight: 1.5 }}>*</span>
                {AdvancedInput('sizeHeight')}
                <span>px</span>
              </div>
            </div>
            <div className="advanced-setting-row">
              <span>上下留白:</span>
              <div>
                {AdvancedInput('blankTop')}
                <span style={{ lineHeight: 1.5 }}>*</span>
                {AdvancedInput('blankBottom')}
                <span>px</span>
              </div>
            </div>
          </div>
        )}
        {UploadButton}
      </div>
    </section>
  );

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={<div className="tabs-item">上传</div>} key="1">
        {Upload}
        <Button onClick={() => userStore.clearUserToken()}>logout</Button>
      </TabPane>
      <TabPane tab={<div className="tabs-item">切图</div>} key="2">
        <Cut />
      </TabPane>
      <TabPane tab={<div className="tabs-item">接口测试</div>} key="3">
        <SimulateRequest />
      </TabPane>
      <TabPane forceRender tab={<div className="tabs-item">DEBUG</div>} key="4">
        <Debug />
      </TabPane>
    </Tabs>
  );
};

export default observer(MaterialUpload);
