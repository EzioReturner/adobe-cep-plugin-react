import { observable, configure, action, runInAction } from 'mobx';
import { message } from 'antd';
import bridge from '@/bridge/controller';
import io from '@api/io';
import { userStore } from './userStore';

configure({ enforceActions: 'observed' });
class MaterialStore {
  @observable documents: string[] = [];

  @observable activeDocument: string | undefined = undefined;

  @observable topLayers: string[] = [];

  @observable selectedLayers: number[] = [];

  @observable uploading: boolean = false;

  @observable scriptOnloaded: boolean = false;

  @observable materialList: StoreKeyValue[] = [];

  @observable selectedMaterial: string | undefined = undefined;

  @observable loadingList: boolean = false;

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

  @action
  loadMaterialList = () => {
    this.loadingList = true;
  };

  @action
  setSelectedMaterial = (val: string) => {
    this.selectedMaterial = val;
  };

  handleSavePng = async () => {
    const result = await bridge.invokePlugin('dispatchSavePng');
    console.log('result', result);
  };

  handleCutSelectedLayer = async () => {
    const result = await bridge.invokePlugin('dispatchCutSelectedLayer');

    if (result === 'null') {
      message.error('请选择图层');
    }
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

    const result = await bridge.invokePlugin('dispatchSavePng');

    console.log('save image path:', result);

    // message.info(result);

    if (result) {
      const [path, docName] = result.split('/,/');
      io.get(`http://localhost:7701/upload`, {
        params: {
          path,
          docName
        }
      })
        .then(res => {
          const { msg } = res;

          message.success(msg);
        })
        .catch(err => {
          message.error(err);
        })
        .finally(() => {
          this.removeSavePng(path);
        });
    }
  };

  @action
  removeSavePng = async (path: string) => {
    console.log('remove path: ', path);

    io.get('http://localhost:7701/removeFile', {
      params: {
        path
      }
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        message.error(err);
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
