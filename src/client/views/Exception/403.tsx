import React from 'react';
import Exception from '@components/Exception';
import FormatterLocale from '@components/FormatterLocale';

const Exception403 = () => (
  <Exception errorCode="403" title={<FormatterLocale id="exception.403" />} />
);

export default Exception403;
