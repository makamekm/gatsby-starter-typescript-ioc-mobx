import React from 'react';
import debounce from 'debounce';
import { computed, observable, reaction } from 'mobx';
import { useDisposable } from 'mobx-react-lite';
import { IRootService } from './root-sevice.interface';
import { IUser } from '../models/user.model';

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

  // Constructor
  public useHook() {
    React.useEffect(() => this.checkAuth(), []);
  }

  public checkAuth() {
    this.setLoading(true);

    // TODO: Here you can make auth
    this.data.user = {
      id: -1,
      email: 'user@mail.com'
    };

    this.setLoading(false);
  }
}
