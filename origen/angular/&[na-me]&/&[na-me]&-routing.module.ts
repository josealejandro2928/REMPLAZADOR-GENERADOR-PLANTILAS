import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { &[Name]&TableComponent } from './&[na-me]&-table/&[na-me]&-table.component';

const routes: Routes = [
  {
    path: '',
    component: &[Name]&TableComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class &[Name]&RoutingModule { }
