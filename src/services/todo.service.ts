import { computed, observable, action, IObservableArray, toJS } from 'mobx';
import { useInstance } from 'react-ioc';
import { IRootService } from './root-sevice.interface';
import { UserService } from './user.service';

export interface ITodo {
  name: string;
  done?: boolean;
  author: string;
}

export class TodoService implements IRootService {
  @observable public data: {
    inputValue: string;
    todos: ITodo[];
  } = {
    inputValue: '',
    todos: [
      {
        name: 'Make a presentation',
        done: true,
        author: 'user@mail.com'
      },
      {
        name: 'Write sctipt',
        done: false,
        author: 'user@mail.com'
      },
      {
        name: 'Rehearsal',
        done: false,
        author: 'user@mail.com'
      }
    ]
  };

  private userService: UserService;

  // Constructor
  public useHook() {
    this.userService = useInstance(UserService);
  }

  @computed get left() {
    return this.data.todos.filter(todo => !todo.done).length;
  }

  private findTask(text: string) {
    return this.data.todos.find(t => t.name === text);
  }

  @action add = (text: string) => {
    if (!this.findTask(text)) {
      this.data.todos.push({
        name: text,
        done: false,
        author: this.userService.user.email
      });
    }
  };

  @action toggle = (text: string) => {
    const task = this.findTask(text);
    if (task) {
      task.done = !task.done;
    }
  };

  @action remove = (text: string) => {
    (this.data.todos as IObservableArray).replace(this.data.todos.filter(t => t.name !== text));
  };
}
