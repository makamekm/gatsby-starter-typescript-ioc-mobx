import debounce from 'debounce';
import { computed, observable, reaction } from 'mobx';
import { useDisposable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { IRootService } from './root-sevice.interface';

export interface IUser {
  id: number;
  email: string;
}

export class UserService implements IRootService {
  @observable public loading = true;

  @observable private data: {
    user: IUser;
  } = {
    user: null
  };

  @computed get user() {
    return this.data.user;
  }

  @computed get isGuest() {
    return !this.data.user && !this.loading;
  }

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  public useUserChange(callback: (user: IUser) => void) {
    useDisposable(() => reaction(() => this.data.user, callback));
  }

  public useHook() {
    useEffect(() => {
      this.setLoading(true);

      // TODO: make auth
      this.data.user = {
        id: -1,
        email: 'user@mail.com'
      };

      this.setLoading(false);
    }, []);
  }
}
