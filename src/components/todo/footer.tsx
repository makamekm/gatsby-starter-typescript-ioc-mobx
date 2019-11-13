import React, { memo } from 'react';
import { useInstance } from 'react-ioc';
import { TodoService } from '../../services/todo.service';
import { observer } from 'mobx-react';

const Component = () => {
  const todoService = useInstance(TodoService);

  return (
    <div className="footer">
      <span className="todo-count">
        <strong>{todoService.left}</strong> item{todoService.left === 1 ? '' : 's'} left
      </span>
      <style jsx>{`
        .footer {
          padding: 10px 15px 30px;
          height: 20px;
          text-align: center;
          font-size: 15px;
          border-top: 1px solid #e6e6e6;
        }

        .footer:before {
          content: '';
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 50px;
          overflow: hidden;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
            0 17px 2px -6px rgba(0, 0, 0, 0.2);
        }

        .todo-count {
          float: left;
          text-align: left;
        }

        .todo-count strong {
          font-weight: 300;
        }
      `}</style>
    </div>
  );
};

export default memo(observer(Component));
