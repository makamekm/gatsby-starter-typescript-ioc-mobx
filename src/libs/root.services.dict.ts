import * as Comlink from 'comlink';
import { observable, isObservable, isAction, toJS, $mobx, reaction } from 'mobx';
import { toValue } from 'react-ioc';

import { UserService } from '../services/user.service';
import { TodoService } from '../services/todo.service';
import TodoServiceWorker from 'worker-loader?inline=true!../services/todo.service.worker.ts';

const service = typeof window === 'object' ? Comlink.wrap(TodoServiceWorker()) : {};
// const service = Comlink.wrap(TodoServiceWorker());

const serviceProxy = new Proxy(service, {
  get: function(obj, prop) {
    const getValue = k => {
      const l = '___' + k;
      if (this[l] === undefined) {
        this[l] = observable({ value: toJS(TodoService.prototype[prop]) });
      }
      return this[l].value;
    };
    const setValue = (k, value) => {
      const l = '___' + k;
      if (this[l] === undefined) {
        this[l] = observable({ value: toJS(TodoService.prototype[prop]) });
      }
      this[l].value = value;
    };

    if (prop === 'onMount') {
      return function() {
        obj[prop](
          Comlink.proxy(function onMessage(message) {
            console.log(service, message);
            if (message.type === 'change') {
              setValue(message.name, message.value);
            }
          })
        );
      };
    }

    const $is = TodoService.prototype[$mobx] && TodoService.prototype[$mobx].values.has(prop);
    if ($is) {
      return getValue(prop);
    }

    // The default behavior to return the value
    return TodoService.prototype[prop] === undefined ? undefined : obj[prop];
  }
  // set: function() {
  //   throw Error('Cannot set anything using web workers');

  // }
});

// console.log(new TodoServiceWorker());
// TODO: Here you can add root services
export const services = [UserService, [TodoService, toValue(serviceProxy)]];
