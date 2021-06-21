import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/shared/quiz.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(public quizService: QuizService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.quizService.correctAnswerCount = 0;
    this.quizService.questions.forEach((element, index) => {
      if (element.answer === element.participantChoice) {
        this.quizService.correctAnswerCount++;
      }
    });
  }

  onSubmit() {
    this.quizService.submitScore().subscribe(() => {
      this.restart();
    });
  }

  restart() {
    this.router.navigate(['/quiz']);
  }

}
