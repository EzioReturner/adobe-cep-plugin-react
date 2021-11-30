import { observable, configure, action } from 'mobx';
import bridge from '@/bridge/controller';

configure({ enforceActions: 'observed' });
class MaterialStore {
  @observable documents: string[] = [];

  @observable activeDocument: string = '';

  @observable topLayers: string[] = [];

  @observable selectedLayers: number[] = [];

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
    const result = await bridge.invokePlugin('testSavePng');
    console.log('result', result);
  };

  handleCutActiveLayer = async () => {
    const result = await bridge.invokePlugin('cutActiveLayer');
    console.log('result', result);
  };

  handleCutSelectedLayer = async () => {
    const result = await bridge.invokePlugin('cutSelectedLayer');
    console.log('result', result);
  };

  handleMergeLayer = async () => {
    const result = await bridge.invokePlugin('mergeLayer');
    console.log('result', result);
  };

  getLayerById = async () => {
    const result = await bridge.invokePlugin('getLayerById', '23');
    console.log('result', result);
  };
}

export const materialStore = new MaterialStore();
export default MaterialStore;
