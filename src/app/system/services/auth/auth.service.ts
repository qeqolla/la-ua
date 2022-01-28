import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { DocumentData } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$ = new Subject<boolean>();

  constructor(
    private auth: Auth,
    private router: Router,
    private afs: Firestore,
  ) { }

  logOut(): void {
    signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
      this.currentUser$.next(false);
    })
  }

  getUserInfo(id: string): Observable<DocumentData> {
    return docData(doc(this.afs, 'users', id));
  }

  updateUserInfo(user: any, id: string): Promise<void> {
    return setDoc(doc(this.afs, 'users', id), user)
  }
}
