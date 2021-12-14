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
  eventObj.type = 'ra_event_log';
  eventObj.data = message;
  eventObj.dispatch();
}
