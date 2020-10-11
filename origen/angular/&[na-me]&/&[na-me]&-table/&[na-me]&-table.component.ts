import { IPagination } from 'src/app/core/classes/pagination.class';
import { IUser } from 'src/app/core/classes/user.class';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit,ViewChild, HostListener, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { DialogAddEdit&[Name]&Component } from '../dialog-add-edit-&[na-me]&/dialog-add-edit-&[na-me]&.component';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { &[Name]&Service } from '../../../services/&[na-me]&/&[na-me]&.service';
import { ConfirmationDialogComponent } from 'src/app/backend/common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-&[na-me]&-table',
  templateUrl: './&[na-me]&-table.component.html',
  styleUrls: ['./&[na-me]&-table.component.scss'],
})
export class &[Name]&TableComponent implements OnInit, OnDestroy {
  all&[Names]&: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilter&[Name]&: boolean;
  loggedInUser: any;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  initialPage = 10;
  pageSizeOptions: number[] = [this.initialPage, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  query: IPagination = {
    limit: this.initialPage,
    offset: 0,
    total: 0,
    page: 0,
    order: 'id',
    filter: {
      filterText: '',
      properties: [],
    },
  };

  //startRemplace
  function run(schema){
    let dp = ['select'];
    for(let key in schema){
      if(schema[key].showFieldInTable){
        dp.push(key);
      }
    } 
    dp.push('actions');
    return  `displayedColumns: string[] = ${JSON.stringify(dp)}`
  }
  //endRemplace


  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private &[name]&Service: &[Name]&Service,
    private breadcrumbService: BreadcrumbService,

    public dialog: MatDialog,
    public utilsService: UtilsService,
    private showToastr: ShowToastrService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;

    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.createSearchForm();
    this.refreshData();

    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('&[Names]&', true);

    ///////////////////////////////////////////

    this.searchForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged(), debounceTime(250))
      .subscribe((val: any) => {
        if (val.textCtrl.length !== 0) {
          if (val.textCtrl.toString().trim() !== '') {
            this.refreshData();
            this.paginator.firstPage();
          }
        } else {
          this.query = {
            limit: this.initialPage,
            offset: 0,
            total: 0,
            page: 0,
            order: this.query.order || 'id',
            filter: {
              filterText: '',
            },
          };
          this.refreshData();
          this.paginator.firstPage();
        }
      });

    ///////////////////////////////////////////
    ///////////////////////////////////////////

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    ///////////////////////////////////////////////
    //////////////////////////////////////////////
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.isLoading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      //startRemplace
      function run(schema){
        let result = '';
        for(let key in schema){
          if(schema[key].showFieldInTable && (schema[key].type == "STRING" || schema[key].type == "NUMBER" || schema[key].type == "ENUM" ) ){
            result+= `this.query.filter.properties.push('filter[$or][${key}][$like]'); \n \t \t \t`
          }
        }
        return result;
      }
      //endRemplace
    } else {
      this.query.filter.filterText = '';
    }
    this.&[name]&Service.getAll&[Names]&(this.query).subscribe(
      (data) => {
        this.initTable(data.data);
        this.query.total = data.meta.pagination.total;
        this.selection.clear();
        this.isLoading = false;
      },
      (error) => {
        this.selection.clear();
        this.isLoading = false;
      },
    );
  }

  initTable(data) {
    this.all&[Names]& = data;
    this.dataSource = new MatTableDataSource(data);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilter&[Name]& = true;
  }

  hideSearchForm() {
    this.showFilter&[Name]& = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  //////////////////// Pagination Api ////////////////////////////
  OnPaginatorChange(event) {
    if (event) {
      this.query.limit = event.pageSize || this.initialPage;
      this.query.offset = event.pageIndex * event.pageSize;
      this.query.page = event.pageIndex;
    } else {
      this.query.limit = this.initialPage;
      this.query.offset = 0;
      this.query.page = 1;
    }
    this.refreshData();
  }
  /////////////////////////////////////
  /////// Select logic/////////////////

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  //////////////////////////////

  onCreate&[Name]&(): void {
    let dialogRef: MatDialogRef<DialogAddEdit&[Name]&Component, any>;
    dialogRef = this.dialog.open(DialogAddEdit&[Name]&Component, {
      panelClass: 'app-dialog-add-edit-&[na-me]&',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selected&[Name]&: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEdit&[Name]&(&[name]&): void {
    this.&[name]&Service.get&[Name]&(&[name]&).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogAddEdit&[Name]&Component, any>;
        dialogRef = this.dialog.open(DialogAddEdit&[Name]&Component, {
          panelClass: 'app-dialog-add-edit-&[na-me]&',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selected&[Name]&: data.data,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      },
      (error) => {
      },
    );
  }

  async onRemove&[Names]&(elements) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: 'Estas seguro de eliminar este(os) elemento(s)?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(elements.map((item) => this.&[name]&Service.remove&[Name]&(item)));
          this.showToastr.showSucces('Elementos correctamente eliminados', 'Éxito', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.refreshData();
      }
    });
  }

  sortData(event) {
    let value = event.active;
    value = event.direction == 'desc' ? `-${value}` : `${value}`;
    this.query.order = value;
    this.refreshData();
  }
}