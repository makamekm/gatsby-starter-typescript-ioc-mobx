import * as React from 'react';
import { observer } from 'mobx-react';
import TodoRoot from '../components/todo/todo-root';

const IndexPage = () => {
  return (
    <div className="layout">
      <TodoRoot />
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default observer(IndexPage);
