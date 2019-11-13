import React, { memo } from 'react';
import { useInstance } from 'react-ioc';
import { TodoService } from '../../services/todo.service';
import { observer } from 'mobx-react';

const Component = () => {
  const todoService = useInstance(TodoService);
  const onChangeTodo = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    todoService.data.inputValue = e.currentTarget.value;
  }, []);
  const onAddTodo = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      todoService.add(e.currentTarget.value);
      todoService.data.inputValue = '';
    }
  }, []);

  return (
    <>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={onChangeTodo}
        onKeyDown={onAddTodo}
        value={todoService.data.inputValue}
      />
      <style jsx>{`
        .new-todo {
          position: relative;
          margin: 0;
          width: 100%;
          font-size: 24px;
          font-family: inherit;
          font-weight: inherit;
          line-height: 1.4em;
          color: inherit;
          padding: 6px;
          border: 1px solid #999;
          box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          padding: 16px 16px 16px 60px;
          border: none;
          background: rgba(0, 0, 0, 0.003);
          box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
        }

        .new-todo:focus {
          outline: 0;
        }

        .new-todo::-webkit-input-placeholder {
          font-style: italic;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.4);
        }

        .new-todo::-moz-placeholder {
          font-style: italic;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.4);
        }

        .new-todo::input-placeholder {
          font-style: italic;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </>
  );
};

export default memo(observer(Component));
