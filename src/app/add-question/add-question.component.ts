import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, MaxLengthValidator, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private _route: ActivatedRoute,
    public quizService: QuizService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.createForm();
    this.LoadCategories();
    const QnID = Number(this._route.snapshot.paramMap.get('id'));
    this._route.paramMap.subscribe(params => {
      if (QnID) {
        this.pageTitle = "Edit Question";
        this.getQuestion(QnID);
      }
      else {
        this.pageTitle = "Create Question";
      }
    });
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

  getQuestion(id: number) {
    this.quizService.getQuestion(id).subscribe(
      (Question: IQuestion) => {
        this.editQuestion(Question);
        this.question = Question;
      },
      (err: any) => console.log(err)
    );
  }

  editQuestion(question: IQuestion) {
    this.addQuestionForm.patchValue({
      CategoryID: question.CategoryID,
      QnID: question.QnID,
      Qn: question.Qn,
      ImageName: question.ImageName,
      Option1: question.Option1,
      Option2: question.Option2,
      Option3: question.Option3,
      Option4: question.Option4,
      Answer: question.Answer,
      Comment: question.Answer
    });
  }

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
    else if (this.question.QnID) {
      this.quizService.updateQuestion(this.question).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    }
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