import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/shared/quiz.service';
import { ICategory } from '../ICategory';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  categories: ICategory[] = [];

  constructor(public quizService: QuizService,
    private _router: Router) {
    this.GetCategories();
  }

  ngOnInit(): void {
  }

  GetCategories() {
    this.quizService.GetCategories().subscribe(data => {
      this.categories = data as ICategory[];
    },
      error => console.log("Error in fetching categories"),
      () => {
        console.log("Categories has been fetched successfully")
      });
  }

  editButtonClick(categoryId: number) {
    this._router.navigate(['/edit', categoryId]);
  }

  newButtonClick() {
    this._router.navigate(['/create']);
  }

  deleteButtonClick(categoryId: number) {
    this.quizService.deleteCategory(categoryId).subscribe(
      (result: boolean) => {
        if (result) {
          this.GetCategories();
        }
      },
      (err: any) => console.log("Error in deleting category: " + err),
      () => { console.log("Category has been deleted successfully"); }
    );
  }

}
