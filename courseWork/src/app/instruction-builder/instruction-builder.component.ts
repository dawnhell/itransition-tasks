import { Component, OnInit }                  from '@angular/core';
import { Http }                               from '@angular/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { contentHeaders }                     from '../common/headers';

@Component({
  selector: 'app-instruction-builder',
  templateUrl: './instruction-builder.component.html',
  styleUrls: ['./instruction-builder.component.css']
})
export class InstructionBuilderComponent implements OnInit {

  private tags       = [];
  private categories = [];
  private photos     = [];
  private steps      = [];
  
  public commonForm: FormGroup;
  public stepForm: FormGroup;
  
  constructor(private _http: Http, private _formBuilder: FormBuilder) {
    this.getPhotoList();
    this.createCommonForm();
    this.createStepForm();
    this.getCategoryList();
    this.getTagList();
  }
  
  ngOnInit() {}
  
  getCategoryList() {
    this._http.get('/user/get/categories', { headers: contentHeaders })
      .subscribe(
        data => this.categories = data.json(),
        error => console.log(error)
      );
  }
  
  getTagList() {
    this._http.get('/user/get/tags', { headers: contentHeaders })
    .subscribe(
      data => {
        let temp = data.json();
        for(let i = 0; i < temp.length; ++i) {
          this.tags[i] = temp[i].name;
        }
      },
      error => console.log(error)
    );
  }
  
  getPhotoList() {
    this._http.get('user/get/photo', { headers: contentHeaders })
      .subscribe(
        data => this.photos = data.json().results,
        error => console.log(error)
      );
  }
  
  createCommonForm() {
    this.commonForm = this._formBuilder.group({
      title:       ['', Validators.required],
      category:    ['', Validators.required],
      tag:         ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  
  createStepForm() {
    this.stepForm = this._formBuilder.group({
      name:        ['', Validators.required],
      photoName:   ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  
  onCreateStep(event) {
    this.steps.push({
      name: this.stepForm.value.name,
      photoUrl: this.photos[
        this.photos.map(function(element) {
          return element.original_filename;
        })
        .indexOf(this.stepForm.value.photoName[0])]
        .original_file_url,
      description: this.stepForm.value.description
    });
  }
  
  onRemoveStep(index: number) {
    this.steps.splice(index, 1);
  }
  
  onCustomTagCreating(args) {
    let newTag = args.text;
    this.tags.unshift(newTag);
    return newTag;
  }
  
  onCreateInstruction() {
    let instruction = {
      name:        this.commonForm.value.title,
      category:    this.commonForm.value.category,
      tags:        this.commonForm.value.tag,
      description: this.commonForm.value.description,
      steps:       this.steps
    };
    
    this._http.post('/user/add/instruction', instruction, { headers: contentHeaders })
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      );
  }
}
