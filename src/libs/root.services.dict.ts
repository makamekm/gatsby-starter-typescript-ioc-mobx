import * as Comlink from 'comlink';
import { toValue } from 'react-ioc';

import { UserService } from '../services/user.service';
import { TodoService } from '../services/todo.service';
import TodoServiceWorker from 'workerize-loader!../services/todo.service.worker';

const service = Comlink.wrap(TodoServiceWorker());

// console.log(new TodoServiceWorker());
// TODO: Here you can add root services
export const services = [UserService, [TodoService, toValue(service)]];
