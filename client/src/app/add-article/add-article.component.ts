import { Component } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/_services/article.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],
})
export class AddArticleComponent {
  article: Article = {
    title: '',
    content: '' 
  };
  submitted = false;


  constructor(private articleService: ArticleService,private storageService: StorageService) {}

  saveArticle(): void {
    const data = {
      title: this.article.title,
      content: this.article.content,
      userid:this.storageService.getUser().id
    };

    this.articleService.createArticle(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        //this.router.navigate(['/articles']);
      },
      error: (e) => console.error(e)
    });
  }

  newArticle(): void {
    this.submitted = false;
    this.article = {
      title: '',
      content: ''
     
    };
  }
}