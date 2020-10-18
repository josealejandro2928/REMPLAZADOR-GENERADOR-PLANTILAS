import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import {
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { &[Name]&Service } from 'src/app/backend/services/&[na-me]&/&[na-me]&.service';
import { ImagePickerConf } from 'ngp-image-picker';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
 //startRemplace
 function run(schema){
  let result = '';
  for(let key in schema){
    if(schema[key].type=='REFERENCE'&& !schema[key].noCreate && !schema[key].createReference){
      result+=`import { ${schema[key].targetTable}Service } from 'src/app/backend/services/${schema[key].targetTable.toLowerCase()}/${schema[key].targetTable.toLowerCase()}.service';\n`
    }
  }
  return result
}
//endRemplace

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
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  selected&[Name]& = null;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height:'120px',
    width:'160px'
  };
  //startRemplace
  function run(schema){
    let result = '';
    for(let key in schema){
      if(schema[key].type=='IMAGE'){
        result+=`${key}Image&[Name]& = undefined;\n\t${key}Image&[Name]&Change = false;`
      }
    }
    return result
  }
  //endRemplace
  //startRemplace
  function run(schema){
    let result = '';
    for(let key in schema){
      if(schema[key].type=='ENUM' && !schema[key].noCreate){
        result+=`all${key.substring(0,1).toUpperCase()}${key.substring(1,key.length)}:any[] = ${JSON.stringify(schema[key].values)}\n;`
      }
      if(schema[key].type=='REFERENCE' && !schema[key].noCreate){
        result+=`all${schema[key].targetTable.substring(0,1).toUpperCase()}${schema[key].targetTable.substring(1,key.length)}:any[] = []\n;`
      }
    }
    return result
  }
  //endRemplace
  /////////////////////////////////////////////////
  languageData: any = {};
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEdit&[Name]&Component>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private &[name]&Service: &[Name]&Service,
     //startRemplace
 function run(schema){
  let result = '';
  for(let key in schema){
    if(schema[key].type=='REFERENCE'&& !schema[key].noCreate && !schema[key].createReference){
      result+=`private ${schema[key].targetTable.toLowerCase()}Service:${schema[key].targetTable}Service,\n`
    }
  }
  return result
}
//endRemplace
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
 this.languageForm = new FormControl(this.language);
 // -------------------------------------------------------------------------------------------------
  }

  ngOnInit(): void {
    this.createForm();
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.updateLanguageData();
      this.language = data;
      //startRemplace
        function run(schema){
          let result = ''; 
          for(let key in schema){
            if(schema[key].type == "JSON" && schema[key].isForTranslate){
              result+=`this.form.get('${key}').setValue(this.languageData.${key}[this.language] || '');`
            }
          }
          return result;
        }
      //endRemplace
    
    });
    //////////////////////////////////////////////
    this.fetchData();
  }

  createForm(): void {
      this.form = this.fb.group({
        //startRemplace
        function run(schema){
          let result = '';
          for(let key in schema){
            if(schema[key].type!='IMAGE' && !schema[key].noCreate){
              if(schema[key].type == "JSON" && schema[key].isForTranslate){
                result+=`${key}: [this.selected&[Name]&?.${key}[this.language],[`
              }else if(schema[key].type == "JSON" && !schema[key].isForTranslate){
                result+=`${key}: [this.selected&[Name]&?.${key},[`
              }else if(schema[key].type == "STRING" || schema[key].type == "NUMBER" 
              || schema[key].type == "ENUM" || schema[key].type == "BOOLEAN"  ||  schema[key].type == "LONG-STRING"){
                result+=`${key}: [this.selected&[Name]&?.${key},[`
              }else if(schema[key].type == "REFERENCE" && !schema[key].isMultiple ){
                result+=`${key}: [this.selected&[Name]&?.${key.split('Id')[0]}?.id,[`
              }else if(schema[key].type == "REFERENCE" && schema[key].isMultiple ){
                result+=`${key}Ids: [ this.selected&[Name]&?.${key}.map(i=>i?.id),[`
              }else if(schema[key].type == "DATE" || schema[key].type == "DATEONLY"  ){
                result+=`${key}: [this.selected&[Name]&?.${key},[`
              }
              if(schema[key].isRequired){
                result+=`Validators.required]],`
              }else{
                result+=`]],`
              }
            }
          }
          return result
        }
        //endRemplace
      });
       //startRemplace
        function run(schema){
          let result = '';
          for(let key in schema){
            if(schema[key].type=='IMAGE'){
              result+=`this.${key}Image&[Name]& = this.selected&[Name]&?.${key};`
            }
          }
          return result
        }
      //endRemplace
    
    //startRemplace
       function run(schema){
        let result = ''; 
        for(let key in schema){
          if(schema[key].type == "JSON" && schema[key].isForTranslate){
            result+=`this.languageData.${key} = this.selected&[Name]&?.${key} ? { ...this.selected&[Name]&.${key} } 
                    : { [this.language]: this.form.get('${key}').value };`
          }
        }
        return result;
      }
      
    
    //endRemplace
  }

  fetchData(){
    /*Ponga aqui las peticiones para loas datos de Tipo REFERENCE*/ 
      //startRemplace
 function run(schema){
  let result = '';
  for(let key in schema){
    if(schema[key].type=='REFERENCE'&& !schema[key].noCreate && !schema[key].createReference){
      result+=`this.${schema[key].targetTable.toLowerCase()}Service.getAll${schema[key].targetTable}s().subscribe((data)=>{
        this.all${schema[key].targetTable} = data.data;
      },e=>{
        //catch error
      });\n`
    }
  }
  return result
}
//endRemplace
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //startRemplace
  function run(schema){
    let result = '';
    for(let key in schema){
      if(schema[key].type=='IMAGE'){
        result+=`on${key.substring(0,1).toUpperCase()}${key.substring(1,key.length)}ImageChange(dataUri) {
          this.${key}Image&[Name]&Change = true;
          this.${key}Image&[Name]& = dataUri;
        }`
      }
    }
    return result
  }
 //endRemplace
 

  //////////////////////////////////////////
  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    this.updateLanguageData();
    let data = { ...this.form.value, ...this.languageData };
    this.isSaving = true;
    console.log(data);
  //startRemplace
  function run(schema){
    let result = '';
    for(let key in schema){
      if(schema[key].type=='IMAGE'){
        result+=`if (this.${key}Image&[Name]&Change) {
          data.${key} = this.${key}Image&[Name]&;
        }`
      }
    }
    return result
  }
 //endRemplace
    if (!this.isEditing) {
      this.&[name]&Service.create&[Name]&(data).subscribe(
        () => {
          this.showToastr.showSucces('Elemento creado correctamente');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinner.hide();
          this.isSaving = false;
          if (error.status == 404 || error.status == 403) {
            this.dialogRef.close();
          }
        },
      );
    } else {
      let dataOutput = { id: this.selected&[Name]&.id };
      for (let key in data) {
        if (!this.utilsService.isObjectEquals(this.selected&[Name]&[key], data[key])) {
          dataOutput[key] = data[key];
        }
      }
      this.&[name]&Service.edit&[Name]&(dataOutput).subscribe(
        () => {
          this.showToastr.showSucces('Elemento editado correctanmete');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinner.hide();
          this.isSaving = false;
          if (error.status == 404 || error.status == 403) {
            this.dialogRef.close();
          }
        },
      );
    }
  }

  //////////////////////////// UTILS FOR LANGUAGE HANDLE ///////////////////////////////////////
  updateLanguageData() {
    //startRemplace
    function run(schema){
      let result = ''; 
      for(let key in schema){
        if(schema[key].type == "JSON" && schema[key].isForTranslate){
          result+=`this.languageData.${key}[this.language] = this.form.get('${key}').value;`
        }
      }
      return result;
    }
    //endRemplace
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
