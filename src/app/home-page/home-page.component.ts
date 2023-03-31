import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {




  constructor( private dialog:MatDialog ) { }

  ngOnInit(): void {
  }

  openDialog(){
    this.dialog.open(UserRegistrationComponent,{
      data: {

        width:'30%'

      }
    })
  }
}
