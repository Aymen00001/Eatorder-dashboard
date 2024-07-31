import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-specialite',
  templateUrl: './specialite.component.html',
  styleUrls: ['./specialite.component.scss']
})
export class SpecialiteComponent implements OnInit {

  constructor( private apiservice :ApiServices) { }
name: any;
emoji:any;
specialites: any[] = [];

  ngOnInit(): void {
    this.getSpecialites()
  }
  createSpecialite(): void {
    const newSpecialite = {
      name: this.name,
      emoji: this.emoji,
    };

    this.apiservice.createSpecialite(newSpecialite).subscribe(
    
      
      (response) => {
        console.log(newSpecialite);
        this.specialites.push(response);
        console.log('Specialite created successfully:', response);
      },
      (error) => {
        console.error('Error creating specialite:', error);
      }
    );
  }
  getSpecialites(): void {
    this.apiservice.getSpecialites().subscribe(
      (specialites) => {
        this.specialites = specialites;
      },
      (error) => {
        console.error('Error fetching specialites:', error);
      }
    );
  }
}
