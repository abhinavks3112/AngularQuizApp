import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { AuthGuard } from './auth/auth.guard';
import { ListCategoryComponent } from './list-category/list-category.component';
import { ListQuestionComponent } from './list-question/list-question.component';
import { QuizComponent } from './quiz/quiz.component';
import { RegisterComponent } from './register/register.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  //{ path: 'register', component: RegisterComponent },
  { path: 'quiz', component: QuizComponent }, //, canActivate: [AuthGuard] },
  { path: 'result', component: ResultComponent }, //, canActivate: [AuthGuard] },
  { path: 'list', component: ListQuestionComponent },
  { path: 'create', component: AddQuestionComponent },
  { path: 'edit/:id', component: AddQuestionComponent },
  { path: 'listCategory', component: ListCategoryComponent },
  { path: 'createCategory', component: AddCategoryComponent },
  { path: 'editCategory/:id', component: AddCategoryComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
