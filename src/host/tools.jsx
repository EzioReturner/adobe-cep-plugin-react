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

/**
 * @NAME 在指定组中通过name匹配图层
 */
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

/**
 * @NAME 获取指定layers下所有可见图层
 */
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
