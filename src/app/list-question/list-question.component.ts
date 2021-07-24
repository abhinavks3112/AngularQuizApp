import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuizService } from 'src/shared/quiz.service';
import { IQuestion } from '../IQuestion';
import { DropdownModel } from 'src/shared/dropdown.component';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {

  categories: DropdownModel[] = [];
  questionCategories: [] = [];
  questions: IQuestion[] = [];
  noQuestions: boolean = false;
  cancelClicked : boolean = false;

  constructor(public quizService: QuizService,
    private _router: Router) {
    //this.LoadCategories();
    this.LoadQuestions();
  }

  ngOnInit(): void {

  }

  LoadCategories() {
    this.quizService.LoadQuestionCategories().subscribe(data => {
      this.categories = data as DropdownModel[];
    },
      error => console.log("Error in fetching categories"),
      () => {
        console.log("Question Categories has been fetched successfully")
      });
  }

  LoadQuestions() {
    this.quizService.getAllQuestions().subscribe(
      (listQuestions: any) =>{
        this.questions = listQuestions as IQuestion[];
        if(this.questions == undefined || this.questions == null || this.questions.length == 0)
          this.noQuestions = true;
      },
      (err: any) => console.log("Error in fetching questions: " + err),
      () => { console.log("Questions has been fetched successfully"); }
    );
  }

  getOptions(question: IQuestion): any {
    var Options = "1. " + question.Option1 + " <br/> 2. " + question.Option2;
    if (question.Option3 != '' && question.Option3 != undefined) {
      Options = Options + " <br/> 3. " + question.Option3;
    }
    if (question.Option4 != '' && question.Option4 != undefined) {
      Options = Options + " <br/> 4. " + question.Option4;
    }
    return Options;
  }

  editButtonClick(questionId: number) {
    this._router.navigate(['/edit', questionId]);
  }

  newButtonClick() {
    this._router.navigate(['/create']);
  }

  deleteButtonClick(questionId: number) {
    this.quizService.deleteQuestion(questionId).subscribe(
      (result: boolean) => {
        if (result) {
          this.LoadQuestions();
        }
      },
      (err: any) => console.log("Error in deleting question: " + err),
      () => { console.log("Question has been deleted successfully"); }
    );
  }

}
