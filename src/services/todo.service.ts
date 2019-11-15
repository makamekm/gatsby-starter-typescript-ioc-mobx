import { computed, observable, action, IObservableArray } from 'mobx';
import 'reflect-metadata';
import { IRootService } from './root-sevice.interface';
import { UserService } from './user.service';

export interface ITodo {
  name: string;
  done?: boolean;
  author: string;
}

const Service = () : ClassDecorator => {
  return target => {
    console.log(
      'ghghgghhg',
      Reflect.getMetadata('design:paramtypes', target),
      Reflect.getMetadata('design:type', target)
    );
  };
};


@Service()
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
          name: 'Write script',
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

  constructor(private userService: UserService) {}

  // Constructor
  public onMount() {
    // this.userService = useInstance(UserService);
    setTimeout(async () => {
      console.log(await this.userService.test('hello'));
    }, 1000);
  }

  @computed get left() {
    return this.data.todos.filter(todo => !todo.done).length;
  }

  private findTask(text: string) {
    return this.data.todos.find(t => t.name === text);
  }

  @action add(text: string) {
    if (!this.findTask(text)) {
      this.data.todos.push({
        name: text,
        done: false,
        author: this.userService ?.user ?.email
      });
    }
    return this.data.todos[this.data.todos.length - 1];
  };

  @action toggle(text: string) {
    const task = this.findTask(text);
    if (task) {
      task.done = !task.done;
    }
  };

  @action remove(text: string) {
    (this.data.todos as IObservableArray).replace(this.data.todos.filter(t => t.name !== text));
  };
}

TodoService['__toInject'] = [['userService', UserService]];
