import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, MaxLengthValidator, MinLengthValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModel } from 'src/shared/dropdown.model';
import { QuizService } from 'src/shared/quiz.service';
import { IQuestion } from '../IQuestion';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  categories: DropdownModel[] = [];
  question: IQuestion = { QnID: -1, CategoryID: 1, Qn: '', ImageName: '', Option1: '', Option2: '', Option3: '', Option4: '', Answer: 1, Comment: '' };

  addQuestionForm = this.formBuilder.group({
  });

  pageTitle: string = 'Create Quiz';

  // Contain validation message for each validation for each form control
  validationMessages: { [key: string]: any } = {
    'Qn': {
      'required': 'Question is required.',
      'minlength': 'Question must be greater than 10 characters.',
      'maxlength': 'Question must be less than 50 characters.',
    },
    'Option1': {
      'required': 'Email is required',
      'minlength': 'Option must be greater than 2 characters.',
      'maxlength': 'Option must be less than 50 characters.',
    },
    'Option2': {
      'minlength': 'Option must be greater than 2 characters.',
      'maxlength': 'Option must be less than 50 characters.',
    },
    'Answer': {
      'required': 'Correct Option is required.',
      'min': 'Correct Option must be between 0 to maximum option you have specified',
      'max': 'Correct Option must be between 0 to maximum option you have specified'
    }
  };

  // Will be assigned validation message based on the field which fails validaton and which validation type it fails
  formErrors: { [key: string]: any } = {
  }

  constructor(private formBuilder: FormBuilder,
    public quizService: QuizService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.createForm();
    this.LoadCategories();
  }

  createForm() {
    this.addQuestionForm = this.formBuilder.group({
      CategoryID: [1],
      QnID: [-1],
      Qn: ['', Validators.required],
      ImageName: [''],
      Option1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      Option2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      Option3: ['', [Validators.minLength(1), Validators.maxLength(25)]],
      Option4: ['', [Validators.minLength(1), Validators.maxLength(25)]],
      Answer: [1, [Validators.required, Validators.min(0), Validators.max(3)]],
      Comment: ['']
    });
  }

  LoadCategories() {
    this.quizService.GetQuestionCategories().subscribe(data => {
      this.categories = data as DropdownModel[];
    },
      error => console.log("Error in fetching categories"),
      () => console.log("Question Categories has been fetched successfully"));
  }

  // getEmployee(id: number) {
  //   this.employeeService.getEmployee(id).subscribe(
  //     (employee: IEmployee) => {
  //       this.editEmployee(employee);
  //       this.employee = employee;
  //     },
  //     (err: any) => console.log(err)
  //   );
  // }

  // editEmployee(employee: IEmployee) {
  //   /*
  //   To bind existing data to form control, we use patchValue
  //   */
  //   this.employeeForm.patchValue({
  //     fullName: employee.fullName,
  //     contactPreference: employee.contactPreference,
  //     emailGroup: {
  //       email: employee.email,
  //       confirmEmail: employee.email
  //     },
  //     phone: employee.phone
  //   });

  /*
 To bind existing data to form array, we use setControl
 */
  //   this.addQuestionForm.setControl('skills', this.setExistingSkills(employee.skills));
  // }

  logValidationErrors(group: FormGroup = this.addQuestionForm): void {
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
    this.MapFormValuesToQuestionModel();
    if (this.question.QnID === -1) {
      this.quizService.addQuestion(this.question).subscribe(
        (data) => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    }
    // else if (this.employee.id) {
    //   this.employeeService.updateEmployee(this.employee).subscribe(
    //     () => this.router.navigate(['list']),
    //     (err: any) => console.log(err)
    //   );
    // }
  }

  MapFormValuesToQuestionModel() {
    this.question.Qn = this.addQuestionForm.controls.Qn.value;
    this.MapOptions();
    this.question.Answer = this.addQuestionForm.controls.Answer.value;
    this.question.Comment = this.addQuestionForm.controls.Comment.value;
  }

  MapOptions() {
    this.question.Option1 = this.addQuestionForm.controls.Option1.value;
    this.question.Option2 = this.addQuestionForm.controls.Option2.value;
    if (this.addQuestionForm.controls.Option3.value != '' && this.addQuestionForm.controls.Option3.value != undefined) {
      this.question.Option3 = this.addQuestionForm.controls.Option3.value;
    }
    if (this.addQuestionForm.controls.Option4.value != '' && this.addQuestionForm.controls.Option4.value != undefined) {
      this.question.Option4 = this.addQuestionForm.value.Option4.value;
    }
  }
}