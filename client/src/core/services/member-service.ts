import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';
import { Pagination, PaginationResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers(MemberParams : MemberParams) {
    let params = new HttpParams();

    params = params.append('pageNumber' , MemberParams.pageNumber);
    params = params.append('pageSize', MemberParams.pageSize);
    params = params.append('minAge' , MemberParams.minAge);
    params = params.append('maxAge', MemberParams.maxAge);
    params = params.append('orderBy', MemberParams.orderBy);
    if(MemberParams.gender) params = params.append('gender', MemberParams.gender);

    return this.http.get<PaginationResult<Member>>(this.baseUrl + 'members/' , {params}).pipe(
      tap(() =>{
        localStorage.setItem('filters' , JSON.stringify(MemberParams))
      })
    )
  }

  getMember(id: string) {

    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => {
        this.member.set(member);
      })
    )
  }

  getMemberPhotos(id: string) {

    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members', member);
  }

  uploadePhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }


  //  getMember(id:string) {

  //   return this.http.get<Member>(this.baseUrl +'members/' + id) , this.getHttpOptipons();
  //  }

  //  private getHttpOptipons(){
  // return {
  //  headers : new HttpHeaders ({
  //   Authorization : 'Bearer ' + this.accountService.currentUser()?.token
  //  })

  // }

  //  }


}
