import React, { useState } from 'react';
import { Button, message, Input, Radio } from 'antd';
import io from '@api/io';

const SimulationRequest: React.FC = () => {
  const [request, setRequest] = useState<any>({
    method: 'post',
    url: '',
    params:
      '',
    channel: 'axios',
    protocol: 'http',
    headers: '{"Content-Type": "application/json"}',
    host: ''
  });

  const [sending, setSending] = useState(false);

  const handleSendRequet = () => {
    const { url, host, params, headers, channel, method, protocol } = request;

    if (!host) return;

    setSending(true);

    if (channel === 'axios') {
      try {
        let _m = method as 'get' | 'post';

        let options: any = {};

        if (params) {
          if (method === 'get') {
            options.params = JSON.parse(params);
          } else {
            options.data = JSON.parse(params);
          }
        }

        if (headers) {
          options.options = {
            headers: JSON.parse(headers)
          };
        }

        io[_m](`${protocol}://${host}${url}`, options)
          .then(res => {
            // message.success(JSON.stringify(res));
            console.log(res);
          })
          .finally(() => {
            setSending(false);
          });
      } catch (error) {
        setSending(false);

        message.error(`请求参数格式错误: ${JSON.stringify(error)}`);
      }
    } else {
      io.post('http://localhost:7701/proxyRequest', {
        data: request
      })
        .then(res => {
          message.success(JSON.stringify(res));
        })
        .finally(() => {
          setSending(false);
        });
    }
  };

  return (
    <div className="simulation-request">
      <div className="form-row">
        <span className="form-label">Protocol:</span>
        <Radio.Group
          onChange={(e: any) =>
            setRequest({
              ...request,
              protocol: e.target.value
            })
          }
          value={request.protocol}
          className="material-select"
        >
          <Radio value="http">http</Radio>
          <Radio value="https">https</Radio>
        </Radio.Group>
      </div>
      <div className="form-row">
        <span className="form-label">Host:</span>
        <Input
          onChange={e =>
            setRequest({
              ...request,
              host: e.target.value
            })
          }
          value={request.host}
          className="material-select"
        />
      </div>
      <div className="form-row">
        <span className="form-label">Url:</span>
        <Input
          onChange={e =>
            setRequest({
              ...request,
              url: e.target.value
            })
          }
          value={request.url}
          className="material-select"
        />
      </div>
      <div className="form-row">
        <span className="form-label">Method:</span>
        <Radio.Group
          onChange={(e: any) =>
            setRequest({
              ...request,
              method: e.target.value
            })
          }
          value={request.method}
          className="material-select"
        >
          <Radio value="get">get</Radio>
          <Radio value="post">post</Radio>
        </Radio.Group>
      </div>
      <div className="form-row">
        <span className="form-label">Pamrams:</span>
        <Input
          onChange={e =>
            setRequest({
              ...request,
              params: e.target.value
            })
          }
          value={request.params}
          className="material-select"
        />
      </div>
      <div className="form-row">
        <span className="form-label">Headers:</span>
        <Input
          onChange={e =>
            setRequest({
              ...request,
              headers: e.target.value
            })
          }
          value={request.headers}
          className="material-select"
        />
      </div>
      <div className="form-row">
        <span className="form-label">Channel:</span>
        <Radio.Group
          onChange={(e: any) =>
            setRequest({
              ...request,
              channel: e.target.value
            })
          }
          value={request.channel}
          className="material-select"
        >
          <Radio value="axios">axios</Radio>
          <Radio value="node">node</Radio>
        </Radio.Group>
      </div>
      <Button
        style={{ width: '130px', margin: '24px 0' }}
        type="primary"
        shape="round"
        onClick={handleSendRequet}
        loading={sending}
      >
        Send
      </Button>
    </div>
  );
};

export default SimulationRequest;
