if (typeof $ == 'undefined') $ = {};

try {
  var xLib = new ExternalObject('lib:PlugPlugExternalObject');
} catch (e) {
  // do nothing
}

$._ext = {
  //Evaluate a file and catch the exception.
  evalFile: function (path) {
    try {
      dispatch(path);
      $.evalFile(path);
    } catch (e) {
      alert('Exception:' + e);
    }
  },
  // Evaluate all the files in the given folder
  evalFiles: function (jsxFolderPath) {
    var folder = new Folder(jsxFolderPath);
    if (folder.exists) {
      var jsxFiles = folder.getFiles('*.jsx');
      for (var i = 0; i < jsxFiles.length; i++) {
        var jsxFile = jsxFiles[i];
        $._ext.evalFile(jsxFile);
      }
    }
  }
};

function dispatch(message) {
  var eventObj = new CSXSEvent();
  eventObj.type = 'event_log';
  eventObj.data = message;
  eventObj.dispatch();
}

function creatNewDocument(params) {
  //使用photoshop api创建文档
  app.documents.add(100, 100, 72, 'test');

  return 'add complated';
}

function getDocuments() {
  var names = [];

  for (var i = 0; i < app.documents.length; i++) {
    names.push(app.documents[i].name);
  }

  return names || [];
}

function getActiveDocument() {
  return app.activeDocument.name;
}

function getLayers() {
  var layers = app.activeDocument.layers;

  var names = [];

  for (var i = 0; i < layers.length; i++) {
    names.push(layers[i].name);
  }

  return names;
}

function setActiveDocument(name) {
  var doc = app.documents.getByName(name);
  app.activeDocument = doc;

  return 'success';
}

function loopLayers(layers, group, log) {
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    layer.visible &&
      log &&
      dispatch(
        'doc.layers[' +
          i +
          '] ' +
          layer.name +
          '. id: ' +
          layer.id +
          '. itemIndex: ' +
          layer.itemIndex +
          '. layer.typename: ' +
          layer.typename
      );
    if (layer.typename == 'LayerSet') {
      // 如果当前图层是图层组，就遍历它里头的图层
      loopLayers(layer.layers, group, log);
    }
    layer.visible && group.push(layer);
  }
}

function testSavePng() {
  var pngfile = new File('/Users/zhev/Downloads/temp001.png');

  var pngSaveOptions = new PNGSaveOptions();

  pngSaveOptions.compression = 1;

  app.activeDocument.saveAs(pngfile, pngSaveOptions, true, Extension.LOWERCASE);

  return 'save success';
}

function getLayerByIdFromTarget(tar, id) {
  var match = null;

  for (var i = 0; i < tar.length; i++) {
    var layer = tar[i];
    if (layer.id == id) {
      match = layer;
      break;
    }
  }

  return match;
}

function getLayerByNameFromTarget(tar, name) {
  var match = null;

  for (var i = 0; i < tar.length; i++) {
    var layer = tar[i];
    if (layer.name == name) {
      match = layer;
      break;
    }
  }

  return match;
}

function cutActiveLayer() {
  var activeDocument = app.activeDocument;

  var layerObj = activeDocument.activeLayer;

  alert(layerObj);

  var cl = layerObj.duplicate();

  var ml = cl.merge();

  ml.name = layerObj.name + ' 切图';

  return 'cut success';
}

function cutSelectedLayer() {
  var selectedLayers = getSelectedLayers();

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

  mergeLayer();
}

function _cutSelectedLayer(ids) {
  alert(ids);

  var _ids = ids ? ids.split(',') : [];

  if (_ids.length <= 1) {
    return cutActiveLayer();
  }

  var target = [];

  loopLayers(activeDocument.layers, target);

  var duplicate = [];

  for (var i = 0; i < _ids.length; i++) {
    var matchLayer = getLayerByIdFromTarget(target, _ids[i]);

    if (matchLayer) {
      var dl = matchLayer.duplicate();
      dl.merge();
      duplicate.push(dl);
    }
  }
}

function mergeLayer() {
  app.activeDocument.activeLayer.merge();
}

/**
 * @NAME 获取当前选中的所有图层
 */
function getSelectedLayers() {
  function idToName(id) {
    var r = new ActionReference();
    r.putIndex(charIDToTypeID('Lyr '), id);
    return executeActionGet(r).getString(charIDToTypeID('Nm  '));
  }
  var layerName;
  var selectedLayers = new Array();
  var ref = new ActionReference();
  ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
  var desc = executeActionGet(ref);
  if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
    desc = desc.getList(stringIDToTypeID('targetLayers'));
    var cnt = desc.count;
    var selectedLayers = new Array();
    var layerId;
    for (var i = 0; i < cnt; i++) {
      try {
        activeDocument.backgroundLayer;
        layerId = desc.getReference(i).getIndex();
      } catch (e) {
        layerId = desc.getReference(i).getIndex() + 1;
      }
      selectedLayers.push(idToName(layerId));
    }
  } else {
    var actLayer = activeDocument.activeLayer;
    layerName = actLayer.name;
    try {
      actLayer.name = layerName;
      executeAction(charIDToTypeID('undo'), undefined, DialogModes.NO);
      selectedLayers.push(layerName);
    } catch (e) {}
  }
  return selectedLayers;
}

/**
 * @NAME 设置图层选中/否
 */
function setSelection(layerName, isActive) {
  var selection, actDesc, actRef;
  if (isActive) {
    selection = 'addToSelection';
  } else {
    selection = 'removeFromSelection';
  }
  actDesc = new ActionDescriptor();
  actRef = new ActionReference();
  actRef.putName(charIDToTypeID('Lyr '), layerName);
  actDesc.putReference(charIDToTypeID('null'), actRef);
  actDesc.putEnumerated(
    stringIDToTypeID('selectionModifier'),
    stringIDToTypeID('selectionModifierType'),
    stringIDToTypeID(selection)
  );
  actDesc.putBoolean(charIDToTypeID('MkVs'), false);
  try {
    executeAction(charIDToTypeID('slct'), actDesc, DialogModes.NO);
    return true;
  } catch (e) {
    return false;
  }
}
