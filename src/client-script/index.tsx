import React from 'react';
import ReactDOM from 'react-dom';
// import Layout from './layouts/index';

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(
  <div className="test">
    Hello World!
    <style jsx>{`
      .test {
        position: fixed;
        top: 50%;
        left: 50%;
        color: red;
        font-size: 20px;
        background-color: #fff;
      }
    `}</style>
  </div>,
  container
);
