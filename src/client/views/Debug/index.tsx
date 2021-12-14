import React, { useState, useEffect } from 'react';
import { Console, Hook, Unhook } from 'console-feed';

const LogsContainer: React.FC = () => {
  const [logs, setLogs] = useState([]);

  // run once!
  // @ts-ignore
  useEffect(() => {
    // @ts-ignore
    Hook(window.console, log => setLogs((currLogs: any) => [...currLogs, log]), false);
    // @ts-ignore
    return () => Unhook(window.console);
  }, []);

  return <Console logs={logs} variant="dark" />;
};

export default LogsContainer;
