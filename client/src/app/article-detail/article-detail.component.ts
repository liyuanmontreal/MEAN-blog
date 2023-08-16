import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/_services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent {

  @Input() viewMode = true;

  @Input() currentArticle: Article = {
    title: '',
    content: ''
  };

  message = '';

  constructor(
    private articleService: ArticleService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.viewMode) {
      this.message = '';
      this.getArticleById(this.route.snapshot.params['id']);
    }
  }

  getArticleById(id: string): void {
    this.articleService.getArticleById(id).subscribe({
      next: (data) => {
        this.currentArticle = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

 

  editArticle():void{
    this.viewMode=false;
  }

  updateArticle(): void {
    this.message = '';
   
    const newdata = {
      title: this.currentArticle.title,
      content: this.currentArticle.content,
      userid:this.storageService.getUser().id
    };

    this.articleService
      .update(this.currentArticle._id, newdata)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This article was updated successfully!';
          //this.router.navigate(['/articles/{{this.currentArticle._id}}']);
        },
        error: (e) => console.error(e)
      });
  }

  deleteArticle(): void {
    this.articleService.delete(this.currentArticle._id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/articles']);
      },
      error: (e) => console.error(e)
    });
  }
}