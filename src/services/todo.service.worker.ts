import * as Comlink from 'comlink';
import { TodoService } from './todo.service';

Comlink.expose(new TodoService());
