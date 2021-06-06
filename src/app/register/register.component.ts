// angular imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

// local imports
import './register.component.css';
import { QuizService } from '../../shared/quiz.service';
import { IParticipant } from '../IParticipant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.formbuilder.group({
    fullName: new FormControl(),
    email: new FormControl()
  });
   
  participant: IParticipant = { id: -1, fullName: '', email: '',  score: 0, timeSpent: 0 };

  // Contain validation message for each validation for each form control
   validationMessages: { [key: string]: any } = {
    'fullName': {
      'required': 'Full Name is required',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 30 characters',
    },
    'email': {
      'required': 'Email is required',
      'minlength': 'Email must be greater than 6 characters',
      'maxlength': 'Email must be less than 30 characters',
      'email': 'Email format must be correct'
    }
  };

  // Will be assigned validation message based on the field which fails validaton and which validation type it fails
  formErrors: { [key: string]: any } = {
  }

  constructor(private formbuilder: FormBuilder,
    private quizService: QuizService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      fullName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ["", [Validators.required, Validators.email,  Validators.minLength(6), Validators.maxLength(30)]]
    });
  }

  onSubmit(){
    this.MapFormValuesToParticipantModel();
    this.quizService.addParticipant(this.participant).subscribe(
      () => this.router.navigate(['/quiz'])
    );
  }

  // Passing employeeForm as default value
  logValidationErrors(group: FormGroup = this.registerForm): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractFormControl = group.get(key);

      // Clear the existing validation error messages, if any
      this.formErrors[key] = '';
      /*
        Check if the control is not valid and it has either been touched or its value changed and also if the control
        is not empty string, in that case display the validation
        error message for that control only
      */
      if (abstractFormControl && !abstractFormControl.valid && abstractFormControl.touched || abstractFormControl?.dirty
        || abstractFormControl?.value !== '') {
        // get all the validation message for particular form control that has failed the vaildation(since we are checking valid condition in if)
        const messages = this.validationMessages[key];
        for (const errorKey in abstractFormControl?.errors) {
          /* Get the validation message corresponding to the failed validation type(eg, required, minlength or maxlength.) identified by errorKey, 
          for particular form control(identified by key) and assign it to the error message field against the form control name error field in formErrors.
          The UI will bind to this object to display the validation errors.
          */
          this.formErrors[key] += messages[errorKey] + '. ';
        }
      }

      /* If the abstractFormControl is an instance of FormGroup i.e a nested FormGroup
      then recursively call this same method (logKeyValuePairs) passing it
      the FormGroup so we can get to the form controls in it*/
      if (abstractFormControl instanceof FormGroup && abstractFormControl) {
        this.logValidationErrors(abstractFormControl);
      }
    });
  }

  MapFormValuesToParticipantModel() {
    this.participant.fullName = this.registerForm.value.fullName;
    this.participant.email = this.registerForm.value.emailGroup.email;
  }
}
