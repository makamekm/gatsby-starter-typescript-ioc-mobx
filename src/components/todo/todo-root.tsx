import React, { memo } from 'react';
import Input from './input';
import List from './list';
import Footer from './footer';

const Component = () => {
  return (
    <div className="todoapp">
      <Input/>
      <List/>
      <Footer/>
      <style jsx>{`
        .todoapp {
          font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
          line-height: 1.4em;
          background: #f5f5f5;
          color: #111111;
          width: 100%;
          min-width: 230px;
          max-width: 550px;
          margin: 0 auto;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-weight: 300;
          text-align: left;
          background: #fff;
          margin: 30px 0 40px 0;
          position: relative;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
                      0 25px 50px 0 rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default memo(Component);
