import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/shared/quiz.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private quizService: QuizService,
    private router: Router) { }

  ngOnInit(): void {
  }

  Signout() {
    localStorage.clear();
    //this.quizService.timer = null;
    this.router.navigate(['/register']);
  }
}
