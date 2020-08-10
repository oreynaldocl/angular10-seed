import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { User } from '../models';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
  ) { }

  getUsers(since: string): Observable<User[]> {
    const param = !!since ? `&since=${since}` : '';
    const url = `/users?per_page=4${param}`;
    return this.http.get<User[]>(url).pipe(
      map((responseBody: any) => {
        return responseBody.map(item => {
          const { login, id, html_url, avatar_url } = item;
          const user: User = {
            userName: login,
            id,
            avatarUrl: avatar_url,
            pageUrl: html_url,
          };
          return user;
        });
      }),
    );
  }

}
