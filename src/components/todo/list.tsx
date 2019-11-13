import React, { memo } from 'react';
import { useInstance } from 'react-ioc';
import { TodoService } from '../../services/todo.service';
import { observer } from 'mobx-react';
import Todo from './todo';
import { useTransition, animated } from 'react-spring';

const Component = () => {
  const todoService = useInstance(TodoService);
  const transitions = useTransition(todoService.data.todos, todo => todo.name, {
    from: { transform: 'translate3d(-40px, 0, 0)', opacity: 0, height: 0 },
    enter: { transform: 'translate3d(0, 0px, 0)', opacity: 1, height: 58 },
    leave: { transform: 'translate3d(-40px, 0, 0)', opacity: 0, height: 0 }
  });

  return (
    <>
      <div className="todo-list">
        {transitions.map(({ item, props, key }) => (
          <animated.div key={key} style={props}>
            <Todo todo={item} />
          </animated.div>
        ))}
      </div>
      <style jsx>{`
        .todo-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
      `}</style>
    </>
  );
};

export default memo(observer(Component));
