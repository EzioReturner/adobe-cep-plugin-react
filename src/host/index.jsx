if (typeof $ == 'undefined') $ = {};

try {
  var xLib = new ExternalObject('lib:PlugPlugExternalObject');
} catch (e) {
  // do nothing
}

function dispatch(message) {
  var eventObj = new CSXSEvent();
  eventObj.type = 'lucky_event_log';
  eventObj.data = message;
  eventObj.dispatch();
}

$._ext = {
  //Evaluate a file and catch the exception.
  evalFile: function (path) {
    try {
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

var creatNewDocument = function (params) {
  //使用photoshop api创建文档
  app.documents.add(100, 100, 72, 'test');

  return 'add complated';
};

var getDocuments = function () {
  var names = [];

  for (var i = 0; i < app.documents.length; i++) {
    names.push(app.documents[i].name);
  }

  return names || [];
};

var getActiveDocument = function () {
  return app.activeDocument.name;
};

var getLayers = function () {
  var layers = app.activeDocument.layers;

  var names = [];

  for (var i = 0; i < layers.length; i++) {
    names.push(layers[i].name);
  }

  return names;
};

var setActiveDocument = function (name) {
  var doc = app.documents.getByName(name);
  app.activeDocument = doc;

  return 'success';
};

var stringIDToTypeID = function (stringId) {
  var TypeId = app.stringIDToTypeID(stringId);

  return TypeId;
};

var testSavePng = function () {
  var pngfile = new File('/Users/zhev/Downloads/temp001.png');

  var pngSaveOptions = new PNGSaveOptions();

  pngSaveOptions.compression = 1;

  app.activeDocument.saveAs(pngfile, pngSaveOptions, true, Extension.LOWERCASE);

  return 'save success';
};
