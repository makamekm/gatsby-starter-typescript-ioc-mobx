import * as Comlink from 'comlink';
import { observable, isObservable, isAction, toJS } from 'mobx';
import { toValue } from 'react-ioc';

import { UserService } from '../services/user.service';
import { TodoService } from '../services/todo.service';
import TodoServiceWorker from 'worker-loader?inline=true!../services/todo.service.worker.ts';

const service = typeof window === 'object' ? Comlink.wrap(TodoServiceWorker()) : {};
// const service = Comlink.wrap(TodoServiceWorker());

const serviceProxy = new Proxy(service, {
  get: function (obj, prop) {
    const key = '___' + String(prop);
    if (typeof TodoService.prototype[prop] !== 'function' && typeof TodoService.prototype[prop] !== 'undefined') {
      if (this[key] === undefined) {
        this[key] = observable({ value: toJS(TodoService.prototype[prop]) });
        setImmediate(async () => {
          const result = await obj[prop];
          this[key].value = result;
        });
      }
      return this[key].value;
    }

    // const adm = service[$mobx];
    // if (!adm) {
    // }
    // console.log(obj, prop, obj[prop], isObservable(obj[prop]) || isComputed(obj[prop]));
    // if (adm && adm.values.has(prop)) {

    // if (isObservable(obj[prop]) || isComputed(obj[prop])) {
    //   console.log('this is a prop!', toJS(obj[prop]));
    //   return toJS(obj[prop]);
    // }

    // if (isAction(obj[prop])) {
    //   console.log('this is an action!');
    //   return async function(...args) {
    //     const result = await obj[prop](...args);
    //     console.log('this is an action return!', result);
    //     if (isObservable(result) || isComputed(result)) {
    //       return toJS(result);
    //     }
    //     return result;
    //   };
    // }

    // throw Error('Cannot run or return non mobx elements');
    // return function (...args) {
    //   obj[prop](...args.map(a => toJS(a)))
    // }

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
