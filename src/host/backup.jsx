function select() {
  var makeVisible = false;

  var c2t = function (s) {
    return app.charIDToTypeID(s);
  };

  var s2t = function (s) {
    return app.stringIDToTypeID(s);
  };

  var descriptor = new ActionDescriptor();

  var list = new ActionList();

  var reference = new ActionReference();

  reference.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('forwardEnum'));

  descriptor.putReference(c2t('null'), reference);

  descriptor.putBoolean(s2t('makeVisible'), makeVisible);

  list.putInteger(214);

  descriptor.putList(s2t('layerID'), list);

  executeAction(s2t('select'), descriptor, DialogModes.NO);
}

function mark1(id) {
  var r = new ActionReference();

  r.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('json'));

  if (doc_id == undefined)
    r.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
  else r.putIdentifier(charIDToTypeID('Dcmn'), doc_id);

  eval('var json = ' + executeActionGet(r).getString(stringIDToTypeID('json')));
}
