import { Component, OnInit } from '@angular/core';

import { QuizService } from '../../shared/quiz.service';
import { IParticipant } from '../IParticipant';
import { IQuestions } from '../IQuestions';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  constructor(public quizService: QuizService,
    private router: Router) { }

  ngOnInit(): void {

    this.quizService.getQuestions(1, 10).subscribe((data) => {
      this.quizService.questions = data;
      console.log(this.quizService.questions);
      console.log(this.quizService.questions[this.quizService.qnProgress].Qn);
      //this.startTimer();
    });
  }

  startTimer() {
    this.quizService.timer = setInterval(() => {
      this.quizService.seconds++;
    }, 1000);
  }

  Answer(questionId: number, choice: number) {
    this.quizService.questions[this.quizService.qnProgress].ParticipantChoice = choice;
    this.quizService.qnProgress++;
    if (this.quizService.qnProgress == 10) {
     // this.quizService.timer = null;
      this.router.navigate(['/result']);
    }
  }
}
