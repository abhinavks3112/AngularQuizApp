import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuizService } from 'src/shared/quiz.service';
import { IQuestion } from '../IQuestion';
import { DropdownModel } from 'src/shared/dropdown.model';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {

  categories: DropdownModel[] = [];
  questions: IQuestion[] = [];

  constructor(public quizService: QuizService,
    private _router: Router) {
    this.LoadCategories();
    this.LoadQuestions();
  }

  ngOnInit(): void {

  }

  LoadCategories() {
    this.quizService.GetQuestionCategories().subscribe(data => {
      this.categories = data as DropdownModel[];
    },
      error => console.log("Error in fetching categories"),
      () => console.log("Question Categories has been fetched successfully"));
  }

  LoadQuestions() {
    this.quizService.getAllQuestions().subscribe(
      (listQuestions: any) => this.questions = listQuestions as IQuestion[],
      (err: any) => console.log("Error in fetching questions: " + err),
      () => console.log("Questions has been fetched successfully")
    );
  }

  getCategoryName(question: IQuestion): any {
    var id: number = question.CategoryID as number;
    if (this.categories != undefined || this.categories != null) {
      var category = this.categories.find(x => console.log(x, x.Id, id));
      if ((category != undefined || category != null)) {
        var name = category.Name;
      }
    }
    return name;
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

}
