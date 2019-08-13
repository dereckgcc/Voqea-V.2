import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [UserService]
})
export class NavbarComponent implements OnInit {
  public identity;

  constructor(
    private _userService: UserService
  ) { 
    this.identity = this._userService.getIdentity()
  }

  ngOnInit() {
  }

}
