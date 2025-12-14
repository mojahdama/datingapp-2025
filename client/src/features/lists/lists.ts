import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from "../../featurws/members/member-card/member-card";
import { PaginationResult } from '../../types/pagination';
import { Paginator } from "../../shared/paginator/paginator";

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {

  private likeService = inject(LikesService);
  protected paginatedResult = signal<PaginationResult<Member> | null>(null)
  //protected members = signal<Member[]>([]);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;
  tabs = [
    {lable :'Liked', value:'liked'},
    {lable :'Liked me', value:'likedBy'},
    {lable :'Mutual', value:'mutual'},
  ]

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.likeService.getLikes(this.predicate ,this.pageNumber , this.pageSize).subscribe({
      next : response => this.paginatedResult.set(response)
    })
  }

  setPredicate(predicate : string){
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  onPageChange(event :{pageNumber : number , pageSize:number}){
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadLikes();
  }
}
