import React from 'react';
import Exception from '@components/Exception';
import FormatterLocale from '@components/FormatterLocale';

const Exception500 = () => (
  <Exception errorCode="500" title={<FormatterLocale id="exception.500" />} />
);

export default Exception500;
