/**
 * @description 操作类型函数文件
 */

function dispatchCreatNewDocument(params) {
  //使用photoshop api创建文档
  app.documents.add(100, 100, 72, 'test');

  return 'add complated';
}

function dispatchSetActiveDocument(name) {
  var doc = app.documents.getByName(name);
  app.activeDocument = doc;

  return 'success';
}

function dispatchSavePng() {
  try {
    var doc = app.activeDocument;

    var docName = doc.name + '-1.png';

    var path = doc.path + '/' + docName;

    var pngfile = new File(path);

    var pngSaveOptions = new PNGSaveOptions();

    pngSaveOptions.compression = 1;

    app.activeDocument.saveAs(pngfile, pngSaveOptions, true, Extension.LOWERCASE);

    return path + '/,/' + docName;
  } catch (error) {
    return false;
  }
}

function dispatchCutActiveLayer() {
  var activeDocument = app.activeDocument;

  var layerObj = activeDocument.activeLayer;

  alert(layerObj);

  var cl = layerObj.duplicate();

  var ml = cl.merge();

  ml.name = layerObj.name + ' 切图';

  return 'cut success';
}

function dispatchCutSelectedLayer() {
  var selectedLayers = getSelectedLayers();

  if (selectedLayers.length == 0) {
    return null;
  }

  var target = [];

  loopLayers(activeDocument.layers, target);

  for (var i = 0; i < selectedLayers.length; i++) {
    var matchLayer = getLayerByNameFromTarget(target, selectedLayers[i]);

    if (matchLayer) {
      var dl = matchLayer.duplicate();

      if (i == 0) {
        activeDocument.activeLayer = dl;
      } else {
        setSelection(dl.name, true);
      }
    }
  }

  dispatchMergeLayer();

  return 'cut success';
}

function dispatchMergeLayer() {
  app.activeDocument.activeLayer.merge();
}

function dispatchSaveDocument() {
  alert(app.activeDocument.path);
}
