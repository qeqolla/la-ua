import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../system/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currentUser: any;
  public userForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initUserForm();
    this.loadUser();
  }

  initUserForm(): void {
    this.userForm = this.fb.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      city: [null, Validators.required],
      street: [null, Validators.required],
      house: [null, Validators.required],
    });
  }

  signOut(): void {
    this.authService.logOut();
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('user')){
      this.currentUser = JSON.parse(localStorage.getItem('user') as string);
      const id = this.currentUser.id;
      this.authService.getUserInfo(this.currentUser.id).subscribe(user => {
        this.currentUser = { ...user, id: id };
        this.updateUserForm();
      })
    } else {
      this.currentUser = null;
    }
  }

  updateUserForm(): void {
    this.userForm.patchValue({
      name: this.currentUser.name,
      phoneNumber: this.currentUser.phoneNumber,
      city: this.currentUser.city,
      street: this.currentUser.street,
      house: this.currentUser.house,
    })
  }

  updateInfo(): void {
    this.authService.updateUserInfo(this.userForm.value, this.currentUser.id).then(() => {
      this.toastr.success('User successfully login!');
      this.loadUser();
    })
  }
}
