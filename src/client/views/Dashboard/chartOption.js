export const globalTrendsOption = {
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '0%',
    right: '1%',
    bottom: '0%',
    top: '0%',
    containLabel: true
  },
  xAxis: [
    {
      show: false,
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  ],
  yAxis: [
    {
      show: false,
      type: 'value'
    }
  ],
  series: [
    {
      smooth: true,
      name: '邮件营销',
      type: 'line',
      lineStyle: {
        color: '#c6f0fd'
      },
      itemStyle: {
        color: '#c6f0fd'
      },
      areaStyle: {
        color: '#c6f0fd'
      },
      data: [0, 132, 21, 184, 90, 230, 0]
    },
    {
      smooth: true,
      name: '联盟广告',
      type: 'line',
      lineStyle: {
        color: '#8ac3e8'
      },
      itemStyle: {
        color: '#8ac3e8'
      },
      areaStyle: {
        color: '#8ac3e8'
      },
      data: [0, 182, 191, 34, 290, 30, 0]
    },
    {
      smooth: true,
      name: '视频广告',
      type: 'line',
      lineStyle: {
        color: '#6bb3e5'
      },
      itemStyle: {
        color: '#6bb3e5'
      },
      areaStyle: {
        color: '#6bb3e5'
      },
      data: [0, 232, 121, 154, 190, 330, 0]
    }
  ]
};
