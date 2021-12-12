/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import c3 from 'c3';
import * as d3 from 'd3';
import './DChart.css';

const DChart = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timer);
    };
  });
  let size = 0;
  let dataForGeneratedChart = [];
  const colors = {};
  let tempData;
  // To copy array without reference
  const data = [];
  const values = [];
  let error = false;
  let styles = {};
  const texts = {
    defaultTextTop: props.defaultTextTop,
    defaultTextMiddle: props.defaultTextMiddle,
    defaultTextBottom: props.defaultTextBottom
  };

  function generateColorsAndDataArray() {
    for (let i = 0; i < props.data.length; i += 1) {
      // generate colors object
      colors[props.data[i].name] = props.data[i].color;
      if (values.includes(props.data[i].name)) {
        error = true;
        console.error('Data names can not be duplicated');
      } else {
        values.push(props.data[i].name);
      }
      data[i] = [props.data[i].name, props.data[i].value];
    }
    tempData = JSON.parse(JSON.stringify(data));
    // If animation should be visible, generate array with value 0 for all elements in chart
    if (props.loadingAnimationDuration) {
      for (let i = 0; i < tempData && tempData.length; i += 1) {
        tempData[i].splice(2, tempData.length);
        tempData[i][1] = 0;
      }
    }
    dataForGeneratedChart = props.loadingAnimationDuration ? tempData : data;
  }

  /**
   * If size is not passed as param
   * get size from parent HTML element
   */

  function getSize() {
    if (!props.size) {
      const htmlChart = d3.select('#chart');
      if (htmlChart._groups[0][0]) {
        const parentElement = htmlChart._groups[0][0].parentNode;
        return parentElement.offsetHeight < parentElement.offsetWidth
          ? parentElement.offsetHeight
          : parentElement.offsetWidth;
      }
    }
    return props.size;
  }

  function setChartSize() {
    size = getSize();
  }

  generateColorsAndDataArray();
  setChartSize();

  function checkIfDataIsEmpty() {
    if (props.data.length === 0) {
      texts.defaultTextTop = 'No assets';

      styles = {
        background: '#f7f7f7',
        borderRadius: '50%',
        width: size,
        height: size
      };
    }
  }

  checkIfDataIsEmpty();

  const chartOnmouseevent = (d, type) => {
    // Working with state here doesn't work on firefox
    const topText = d3.select('#top-text');
    const middleText = d3.select('#middle-text');
    const bottomText = d3.select('#bottom-text');

    topText.html(
      type === 'over' ? props.data[d.index].textTop : texts.defaultTextTop
    );
    middleText.html(
      type === 'over' ? props.data[d.index].textMiddle : texts.defaultTextMiddle
    );
    bottomText.html(
      type === 'over' ? props.data[d.index].textBottom : texts.defaultTextBottom
    );
  };

  const chart = c3.generate({
    bindto: '#chart',
    size: {
      height: size,
      width: size
    },
    data: {
      columns: dataForGeneratedChart,
      colors,
      type: 'donut',
      onmouseover: (d) => {
        chartOnmouseevent(d, 'over');
        if (props.mouseOver) {
          props.mouseOver(d);
        }
      },
      onmouseout: (d) => {
        chartOnmouseevent(d, 'out');
        if (props.mouseOut) {
          props.mouseOut(d);
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      show: false
    },
    donut: {
      width: 25,
      label: {
        show: false
      }
    },
    transition: {
      duration: props.loadingAnimationDuration
    },
    oninit: () => {
      // If error, remove chart before rendering.
      if (error) {
        const element = document.getElementById('chart');
        if (element && element.lastChild) {
          while (element.firstChild) {
            element.removeChild(element.lastChild);
          }
        }
      }
    }
  });

  if (props.loadingAnimationDuration) {
    setTimeout(() => {
      chart.load({
        columns: data
      });
    }, 0);
  }

  function generateTexts() {
    const label = d3.select('text.c3-chart-arcs-title');
    label.html('');

    // Middle text
    label
      .insert('tspan')
      .text(texts.defaultTextMiddle)
      .attr('dy', getSize() / 21)
      .attr('x', 0)
      .attr('id', 'middle-text')
      .style('font-size', `${getSize() / 9.5}px`)
      .attr('class', 'value');

    // Top text
    label
      .insert('tspan')
      .text(texts.defaultTextTop)
      .attr('dy', getSize() / -6.46)
      .attr('x', 0)
      .attr('id', 'top-text')
      .style('font-size', `${getSize() / 16.55}px`)
      .attr('class', 'title');

    // Bottom text
    label
      .insert('tspan')
      .text(texts.defaultTextBottom)
      .attr('dy', getSize() / 3.8)
      .attr('x', 0)
      .attr('id', 'bottom-text')
      .style('font-size', `${getSize() / 21}px`)
      .attr('class', 'bottomText');
  }

  generateTexts();

  window.addEventListener('resize', () => {
    chart.resize({
      width: getSize(),
      height: getSize()
    });
    generateTexts();
  });

  return (
      <div id="chart" style={styles} />
  );
};

export default DChart;
