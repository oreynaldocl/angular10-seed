import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  @Input() users: User[];

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goToRepo(userName: string): void {
    this.router.navigate(['/repos', userName]);
  }

}
