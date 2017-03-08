import { Component, OnInit }                from '@angular/core';
import {Http}                               from "@angular/http";
import {contentHeaders}                     from "../common/headers";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-instruction-builder',
  templateUrl: './instruction-builder.component.html',
  styleUrls: ['./instruction-builder.component.css']
})
export class InstructionBuilderComponent implements OnInit {

  private simpleProducts = [
    "tag1",
    "tag2",
    "tag3"
  ];
  private photos = [];
  private steps = [
  ];
  
  public stepForm: FormGroup;
  
  constructor(private _http: Http, private _formBuilder: FormBuilder) {
    this.getPhotoList();
    this.createStepForm();
  }
  
  getPhotoList() {
    this._http.get('user/get/photo', { headers: contentHeaders })
      .subscribe(
        data => this.photos = data.json().results,
        error => console.log(error)
      );
  }
  
  createStepForm() {
    this.stepForm = this._formBuilder.group({
      name: ["", Validators.required],
      photoName: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.steps.push(
      {
        name: "First step name",
        photoUrl: "https://ucarecdn.com/ee2b002d-00d9-4479-b74e-36882682893a/mountain.jpg",
        description: "This is the description"
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
    console.log(this.steps);
  }
  
  onRemoveStep(index: number) {
    this.steps.splice(index, 1);
  }

}
