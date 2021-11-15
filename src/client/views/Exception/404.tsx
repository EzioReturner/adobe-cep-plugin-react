import React from 'react';
import Exception from '@components/Exception';
import FormatterLocale from '@components/FormatterLocale';

const Exception404 = () => (
  <Exception errorCode="404" title={<FormatterLocale id="exception.404" />} />
);

export default Exception404;
