import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InitialComponent } from './initial/initial.component';

const ROUTES: Routes = [
  { path: '', component: InitialComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    NgbModule,
  ],
  declarations: [
    InitialComponent,
  ],
})
export class InitialModule { }
