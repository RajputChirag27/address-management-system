import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  handleUserUpdated(updatedUser: User) {
    const index = this.users.findIndex(user => user._id === updatedUser._id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  handleUserAdded(newUser: User) {
    this.users.push(newUser);
  }

  handleUserDeleted(userId: string) {
    this.users = this.users.filter(user => user._id !== userId);
  }

  handleAddNewUser() {
    const newUser: User = {
      _id: '',
      userName: '',
      email: '',
      addresses: []
    };
    this.users.push(newUser);
  }
  
}
