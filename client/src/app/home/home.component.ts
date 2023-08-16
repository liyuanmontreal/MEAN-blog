import { Component, OnInit } from '@angular/core';
import { Article} from 'src/app/models/article.model';
import { ArticleService } from '../_services/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  
  articles?: Article[];
 
  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.retrieveArticles();
  }

  retrieveArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
       
      },
      error: (e) => console.error(e)
    });
  }
}

  // ngOnInit(): void {
  //   this.userService.getPublicContent().subscribe({
  //     next: data => {
  //       this.content = data;
  //     },
  //     error: err => {console.log(err)
  //       if (err.error) {
  //         this.content = JSON.parse(err.error).message;
  //       } else {
  //         this.content = "Error with status: " + err.status;
  //       }
  //     }
  //   });
  //}










