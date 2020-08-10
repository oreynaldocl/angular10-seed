import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { User } from '../../core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  @Input() users: User[];

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
