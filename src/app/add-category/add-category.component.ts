import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/shared/quiz.service';
import { ICategory } from '../ICategory';
import { IQuestion } from '../IQuestion';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  category: ICategory = { CategoryId: -1, Name: '', Description: '' };

  addCategoryForm = this.formBuilder.group({
  });

  pageTitle: string = 'Create Question';

  // Contain validation message for each validation for each form control
  validationMessages: { [key: string]: any } = {
    'Name': {
      'required': 'Question is required.',
      'minlength': 'Question must be greater than 1 characters.',
      'maxlength': 'Question must be less than 50 characters.',
    }
  };

  // Will be assigned validation message based on the field which fails validaton and which validation type it fails
  formErrors: { [key: string]: any } = {
  }


  constructor(private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    public quizService: QuizService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.createForm();
    const CategoryId = Number(this._route.snapshot.paramMap.get('id'));
    this._route.paramMap.subscribe(params => {
      if (CategoryId) {
        this.pageTitle = "Edit Category";
        this.getCategory(CategoryId);
      }
      else {
        this.pageTitle = "Create Category";
      }
    });
  }

  createForm() {
    this.addCategoryForm = this.formBuilder.group({
      CategoryId: [-1],
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      Description: ['']
    });
  }

  getCategory(id: number) {
    this.quizService.getCategory(id).subscribe(
      (Category: ICategory) => {
        this.category = Category;
      },
      (err: any) => console.log(err),
      () => this.editCategory(this.category)
    );
  }

  editCategory(category: ICategory) {
    this.addCategoryForm.patchValue({
      CategoryID: category.CategoryId,
      Name: category.Name,
      Description: category.Description
    });
  }

  logValidationErrors(group: FormGroup = this.addCategoryForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractFormControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractFormControl && !abstractFormControl.valid && abstractFormControl.touched || abstractFormControl?.dirty
        || abstractFormControl?.value !== '') {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractFormControl?.errors) {
          this.formErrors[key] += messages[errorKey] + ' ';
        }
      }
      if (abstractFormControl instanceof FormGroup && abstractFormControl) {
        this.logValidationErrors(abstractFormControl);
      }
    });
  }

  onSubmit(): void {
    this.MapFormValuesToCategoryModel();
    if (this.category.CategoryId === -1) {
      this.quizService.addCategory(this.category).subscribe(
        (data: any) => this.router.navigate(['listCategory']),
        (err: any) => console.log(err)
      );
    }
    else if (this.category.CategoryId) {
      this.quizService.updateCategory(this.category).subscribe(
        () => this.router.navigate(['listCategory']),
        (err: any) => console.log(err)
      );
    }
  }

  MapFormValuesToCategoryModel() {
    this.category.Name = this.addCategoryForm.controls.Name.value;
    this.category.Description = this.addCategoryForm.controls.Description.value;
  }

}
