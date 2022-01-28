import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../../system/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  public authForm!: FormGroup;
  public loginSubscription!: Subscription;
  public isLogin = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initAuthForm();
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  registerUser(): void {
    const { email, password } = this.authForm.value;
    this.emailSignUp(email, password).then(() => {
      this.toastr.success('User successfully created!');
      this.isLogin = !this.isLogin;
      this.authForm.reset();
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      name: '',
      dateOfBirth: '',
      phoneNumber: '',
      city: '',
      street: '',
      house: '',
      orders: [],
      role: 'USER'
    }
    let data = await setDoc(doc(this.afs, "users", credential.user.uid), user);
    return data;
  }

  async login(email: string, password: string): Promise<any> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      localStorage.setItem('user', JSON.stringify({ ...user, id: credential.user.uid }));
      if(user && user['role'] === 'ADMIN'){
        this.router.navigate(['/admin']);
      } else if(user && user['role'] === 'USER'){
        this.router.navigate(['/profile']);
      }
      this.authService.currentUser$.next(true);
    });
  }

  loginUser(): void {
    const { email, password } = this.authForm.value;
    this.login(email, password).then(() => {
      this.toastr.success('User successfully login!');
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }

  changeIsLogin(): void {
    this.isLogin = !this.isLogin;
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
