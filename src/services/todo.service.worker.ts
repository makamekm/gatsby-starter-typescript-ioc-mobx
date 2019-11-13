import * as Comlink from 'comlink';
import { $mobx, toJS, isObservable, isComputed, isAction } from 'mobx';
import { TodoService } from './todo.service';

const service = new TodoService();

const serviceProxy = new Proxy(service, {
  get: function(obj, prop) {
    // const adm = service[$mobx];
    // if (!adm) {
    // }
    // console.log(obj, prop, obj[prop], isObservable(obj[prop]) || isComputed(obj[prop]));
    // if (adm && adm.values.has(prop)) {

    if (isObservable(obj[prop]) || isComputed(obj[prop])) {
      console.log('this is a prop!', toJS(obj[prop]));
      return toJS(obj[prop]);
    }

    if (isAction(obj[prop])) {
      console.log('this is an action!');
      return async function(...args) {
        const result = await obj[prop](...args);
        console.log('this is an action return!', result);
        if (isObservable(result) || isComputed(result)) {
          return toJS(result);
        }
        return result;
      };
    }

    throw Error('Cannot run or return non mobx elements');

    // The default behavior to return the value
    return obj[prop];
  },
  set: function(obj, prop, value) {
    throw Error('Cannot set anything using web workers');

    // The default behavior to store the value
    obj[prop] = value;

    // Indicate success
    return true;
  }
});

Comlink.expose(serviceProxy);
