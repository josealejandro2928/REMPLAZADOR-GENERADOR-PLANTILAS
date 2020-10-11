import { UtilsService } from './../../../../core/services/utils/utils.service';
import { environment } from './../../../../../environments/environment';
import {
  Component,
  Inject,
  HostListener,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { &[Name]&Service } from '../../../services/&[na-me]&/&[na-me]&.service';
import { ImagePickerConf } from 'ngp-image-picker';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-dialog-add-edit-&[na-me]&',
  templateUrl: './dialog-add-edit-&[na-me]&.component.html',
  styleUrls: ['./dialog-add-edit-&[na-me]&.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEdit&[Name]&Component implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  selected&[Name]& = null;

  image&[Name]& = null;
  compressImage&[Name]& = null;
  image&[Name]&Change = false;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEdit&[Name]&Component>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private &[name]&Service: &[Name]&Service,
    private showToastr: ShowToastrService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selected&[Name]& = data.selected&[Name]&;
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // -------------------------------------------------------------------------------------------------
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
      if (this.form && this.isEditing) {
        this.form.get('title').setValue(this.selected&[Name]&.title[this.language] || '');
        this.form.get('subTitle').setValue(this.selected&[Name]&.subTitle[this.language] || '');
      }
    });
    //////////////////////////////////////////////
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        title: [
          this.selected&[Name]& && this.selected&[Name]&.title ? this.selected&[Name]&.title[this.language] : null,
          [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required],
        ],
        status: [this.selected&[Name]&?.status || 'enabled'],
        subTitle: [
          this.selected&[Name]& && this.selected&[Name]&.subTitle
            ? this.selected&[Name]&.subTitle[this.language]
            : null,
          [Validators.maxLength(200)],
        ],
        link: [
          this.selected&[Name]&.link,
          [
            Validators.pattern(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            ),
          ],
        ],
      });
      this.image&[Name]& = this.selected&[Name]&.image;
    } else {
      this.form = this.fb.group({
        title: [null, [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required]],
        subTitle: [null, [Validators.maxLength(200)]],
        status: [this.selected&[Name]&?.status || 'enabled'],
        link: [
          null,
          [
            Validators.pattern(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            ),
          ],
        ],
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onImageChange(dataUri) {
    this.image&[Name]&Change = true;
    this.image&[Name]& = dataUri;
  }

  //////////////////////////////////////////

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = this.form.value;
    if (this.image&[Name]&Change) {
      data.image = this.image&[Name]&;
    }

    if (!this.isEditing) {
      data = this.parseLanguaje(data, this.language);
      this.&[name]&Service.create&[Name]&(data).subscribe(
        () => {
          this.showToastr.showSucces('Elemento creado correctamente');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.dialogRef.close();
          this.spinner.hide();
        },
      );
    } else {
      data = this.parseLanguajeEdit(data, this.selected&[Name]&, this.language);
      data.id = this.selected&[Name]&.id;
      console.log(data);
      this.&[name]&Service.edit&[Name]&(data).subscribe(
        () => {
          this.showToastr.showSucces('Elemento editado correctanmete');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.dialogRef.close();
          this.spinner.hide();
        },
      );
    }
  }

  //////////////////////////// UTILS FOR LANGUAGE HANDLE ///////////////////////////////////////
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  parseLanguaje(data, lang) {
    data.title = { [lang]: data.title };
    data.subTitle = { [lang]: data.subTitle };
    return data;
  }

  parseLanguajeEdit(data, olData, lang) {
    if (data.title != undefined) {
      olData.title[lang] = data.title;
      data.title = { ...olData.title };
    }
    if (data.subTitle != undefined) {
      olData.subTitle[lang] = data.subTitle;
      data.subTitle = { ...olData.subTitle };
    }

    return data;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
