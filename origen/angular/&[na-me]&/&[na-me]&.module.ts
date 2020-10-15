import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
////////// --------MATERIAL MODULES------- /////////////////////////
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { DialogAddEdit&[Name]&Component } from './dialog-add-edit-&[na-me]&/dialog-add-edit-&[na-me]&.component';
import { &[Name]&RoutingModule } from './&[na-me]&-routing.module';
import { &[Name]&TableComponent } from './&[na-me]&-table/&[na-me]&-table.component';
import { MatSortModule } from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { MatNativeDateModule } from '@angular/material/core';
///////////////////////////////////////////////////////////////////

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatDividerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    &[Name]&RoutingModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgpImagePickerModule,
    PipesModule
  ],
  declarations: [&[Name]&TableComponent, DialogAddEdit&[Name]&Component],
  entryComponents: [DialogAddEdit&[Name]&Component],
})
export class &[Name]&Module {}
