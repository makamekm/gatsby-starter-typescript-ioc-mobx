import * as Comlink from 'comlink';
import { $mobx, toJS, isObservable, isComputed, isAction, autorun, observable } from 'mobx';
import { TodoService } from './todo.service';

const service = new TodoService();

// if (TodoService.prototype[$mobx] && TodoService.prototype[$mobx] && TodoService.prototype[$mobx].values) {
//   TodoService.prototype[$mobx].values.forEach((_value, key) => {
//   }
// }

// reaction(
//   () => counter.count,
//   (count, reaction) => {
//       // console.log("reaction 3: invoked. counter.count = " + count)
//       // reaction.dispose();
//   }
// )

const serviceProxy = new Proxy(service, {
  get: function(obj, prop) {
    if (prop === 'onMount') {
      return async function(cb, callService, ...args) {
        for (const key of Object.getOwnPropertyNames(service['__proto__'])) {
          obj[key]; // Initialize
        }

        await new Promise(r => setImmediate(r));

        for (const index in TodoService['__toInject']) {
          const [key, clazz] = TodoService['__toInject'][index];
          console.log('initInjection', key, clazz);
          obj[key] = new Proxy(
            {},
            {
              get: function(s, p) {
                const getValue = k => {
                  const l = '___' + k;
                  if (s[l] === undefined) {
                    s[l] = observable({ value: toJS(TodoService.prototype[prop]) });
                  }
                  return s[l].value;
                };
                const $is = clazz.prototype[$mobx] && clazz.prototype[$mobx].values.has(prop);
                if ($is) {
                  return getValue(p);
                } else {
                  return async function(...args) {
                    return await callService(index, p, args);
                  };
                }
              }
            }
          );
        }

        if (obj[prop]) {
          await (obj[prop] as any).apply(obj, args);
        }

        Object.getOwnPropertyNames(service['__proto__']).forEach(key => {
          const $is = obj[$mobx] && obj[$mobx].values.has(key);
          console.log(
            'onMount',
            key,
            // obj,
            // obj[$mobx] && obj[$mobx].values,
            $is
            // isObservable(obj[key]),
            // isComputed(obj[key]),
            // service['__proto__']
          );
          if ($is) {
            autorun(() => {
              cb({ type: 'change', name: key, value: toJS(obj[key]) });
              console.log('reaction', key, obj[key]);
              // reaction.dispose();
            });
            // cb('test');
            // console.log('onMount', key);
          }
        });
      };
    }
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

    // console.error(prop, obj[prop], isComputed(obj[prop]));
    // throw Error('Cannot run or return non mobx elements');

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

// export default serviceProxy;

Comlink.expose(serviceProxy);
