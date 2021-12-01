/**
 * @description 取值相关函数文件
 */

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
