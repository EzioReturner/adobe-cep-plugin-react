import React, { Component } from 'react';
import { bind, clear } from 'size-sensor';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  GaugeChart,
  EffectScatterChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  GaugeChart,
  EffectScatterChart,
  CanvasRenderer,
  LegendComponent,
  DatasetComponent
]);

interface EchartProps {
  option: StoreKeyValue[] | StoreKeyValue;
  theme?: string;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onEvents?: { [eventName: string]: (args0: any) => void };
}

class EchartsReact extends Component<EchartProps> {
  public echartsDOM: any;

  initChart() {
    const chartObj = this.renderChart();
    bind(this.echartsDOM, () => {
      chartObj.resize();
    });
    this.initEvent();
  }

  /**事件初始化 */
  initEvent() {
    const { onEvents } = this.props;
    if (!onEvents) return;

    const bindEvent = (event: string) => {
      this.getInstance().off(event);
      this.getInstance().on(event, (val: any) => this.props.onEvents![event](val));
    };

    Object.keys(onEvents).forEach(event => {
      if (typeof event !== 'string' || typeof onEvents[event] !== 'function') return;
      bindEvent(event);
    });
  }

  componentDidUpdate() {
    let { option } = this.props;
    // 对数图异常做特殊处理
    const _option: StoreKeyValue[] = Array.isArray(option) ? option : [option];
    if (['treemap', 'pie'].includes(_option[0].series?.[0].type)) {
      this.dispose();
      setTimeout(() => {
        this.renderChart();
        this.initEvent();
      }, 30);
    } else {
      this.renderChart();
    }
  }

  getInstance() {
    const theme = !this.props.theme || this.props.theme === 'system' ? 'default' : this.props.theme;

    return echarts.getInstanceByDom(this.echartsDOM) || echarts.init(this.echartsDOM, theme);
  }

  componentDidMount() {
    this.initChart();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dispose() {
    clear(this.echartsDOM);
    this.echartsDOM && echarts.dispose(this.echartsDOM);
  }

  renderChart() {
    const chartObj = this.getInstance();
    let { option } = this.props;
    const { notMerge, lazyUpdate } = this.props;
    const _option: StoreKeyValue[] = Array.isArray(option) ? option : [option];

    _option.forEach(op => {
      chartObj.setOption(op || {}, notMerge || false, lazyUpdate || false);
    });
    return chartObj;
  }

  render() {
    const { style, className } = this.props;
    const domStyle = {
      height: '280px',
      ...style
    };
    return (
      <div
        style={domStyle}
        className={`echarts-react ${className || ''}`}
        ref={e => {
          this.echartsDOM = e;
        }}
      />
    );
  }
}

export default EchartsReact;
