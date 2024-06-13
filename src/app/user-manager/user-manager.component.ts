import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { User, Address } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() userUpdated = new EventEmitter<User>();
  @Output() userAdded = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<string>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      _id: [''],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      addresses: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.user) {
      this.setUserForm(this.user);
    }
  }

  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  setUserForm(user: User) {
    this.userForm.patchValue(user);
    this.user?.addresses.forEach(address => {
      this.addresses.push(this.fb.group(address));
    });
  }

  addAddress() {
    this.addresses.push(this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    }));
    this.emitUserUpdated();
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
    this.emitUserUpdated();
  }

  saveUser() {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      if (user._id) {
        this.userService.updateUser(user).subscribe(updatedUser => {
          this.userUpdated.emit(updatedUser);
        });
      } else {
        this.userService.addUser(user).subscribe(newUser => {
          this.userAdded.emit(newUser);
        });
      }
    }
  }

  deleteUser() {
    if (this.user && this.user._id) {
      this.userService.deleteUser(this.user._id).subscribe(() => {
        this.userDeleted.emit(this.user!._id);
      });
    }
  }

  emitUserUpdated() {
    if (this.userForm.valid) {
        const updatedUser = this.userForm.value;
        this.userUpdated.emit(updatedUser);
      }
    }
  }
  