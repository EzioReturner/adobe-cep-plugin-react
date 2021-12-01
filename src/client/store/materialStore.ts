import { observable, configure, action, runInAction } from 'mobx';
import { message } from 'antd';
import bridge from '@/bridge/controller';
import io from '@api/io';

configure({ enforceActions: 'observed' });
class MaterialStore {
  @observable documents: string[] = [];

  @observable activeDocument: string = '';

  @observable topLayers: string[] = [];

  @observable selectedLayers: number[] = [];

  @observable uploading: boolean = false;

  @action
  setDocuments = (documents: string[]) => {
    this.documents = documents;
  };

  @action
  dispatchSetActiveDocument = (active: string) => {
    this.activeDocument = active;
  };

  @action
  handleChangeDocument = (doc: string) => {
    this.activeDocument = doc;

    bridge.dispatchSetActiveDocument(doc);
  };

  @action
  updateSelectedLayer = (layerIds: number[]) => {
    this.selectedLayers = layerIds;
  };

  handleGetLayers = async () => {
    const result = await bridge.invokePlugin('getLayers');

    this.topLayers = result.split(',');
    console.log('result', result);
  };

  handleSavePng = async () => {
    const result = await bridge.invokePlugin('dispatchTestSavePng');
    console.log('result', result);
  };

  handleCutActiveLayer = async () => {
    const result = await bridge.invokePlugin('dispatchCutActiveLayer');
    console.log('result', result);
  };

  handleCutSelectedLayer = async () => {
    const result = await bridge.invokePlugin('dispatchCutSelectedLayer');

    if (result === 'null') {
      message.error('请选择图层');
    }
    console.log('result', result);
  };

  handleMergeLayer = async () => {
    const result = await bridge.invokePlugin('dispatchMergeLayer');
    console.log('result', result);
  };

  getLayerById = async () => {
    const result = await bridge.invokePlugin('getLayerById', '23');
    console.log('result', result);
  };

  importDoc = () => {
    io.get('http://localhost:7701/import', {
      options: {
        headers: {
          directory: bridge.scriptLoader?.extensionDirectory
        }
      }
    }).then(res => {
      console.log(res);
    });
  };

  @action
  handleUpload = async () => {
    this.uploading = true;

    const result = await bridge.invokePlugin('dispatchTestSavePng');

    if (result) {
      const [path, docName] = result.split('/,/');
      io.get('http://localhost:7701/upload', {
        params: {
          path,
          docName
        }
      })
        .then(res => {
          const { status, msg } = res;

          if (status === 0 && msg === 'SUCCESS') {
            message.success('上传成功');
          } else {
            console.log(status, msg);
          }
        })
        .finally(() => {
          this.removeSavePng(path);
        });
    }
  };

  @action
  removeSavePng = async (path: string) => {
    io.get('http://localhost:7701/removeFile', {
      params: {
        path
      }
    })
      .then(res => {
        console.log(res);
      })
      .finally(() => {
        runInAction(() => {
          this.uploading = false;
        });
      });
  };
}

export const materialStore = new MaterialStore();
export default MaterialStore;
