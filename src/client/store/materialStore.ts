import { observable, configure, action } from 'mobx';
import bridge from '@/bridge/controller';

configure({ enforceActions: 'observed' });
class MaterialStore {
  @observable documents: string[] = [];

  @observable activeDocument: string = '';

  @observable topLayers: string[] = [];

  @action
  setDocuments = (documents: string[]) => {
    this.documents = documents;
  };

  @action
  setActiveDocument = (active: string) => {
    this.activeDocument = active;
  };

  @action
  handleChangeDocument = (doc: string) => {
    this.activeDocument = doc;

    bridge.setActiveDocument(doc);
  };

  handleGetLayers = async () => {
    const result = await bridge.invokePlugin('getLayers');

    this.topLayers = result.split(',');
    console.log('result', result);
  };

  handleSavePng = async () => {
    const result = await bridge.invokePlugin('testSavePng');
    console.log('result', result);
  };
}

export const materialStore = new MaterialStore();
export default MaterialStore;
