import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { TranslateService } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';



@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    user: User = {} as User; // Initialize with an empty User object
    baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
    currentUser = JSON.parse(localStorage.getItem('user')!);
    userId: string = this.currentUser._id;
    image: string = this.currentUser.image;
    imageUrl: string = this.baseUrl  + this.image;

    constructor(public sidebarservice: SidebarService, private api: ApiServices) { }

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }

    ngOnInit() {
        const user = this.api.getUser();
        if (user !== null) {
            this.user = user;
        } else {
            // Handle the case when the user is null
        }
        /* Search Bar */
        $(document).ready(function () {
            $(".mobile-search-icon").on("click", function () {
                $(".search-bar").addClass("full-search-bar")
            }),
                $(".search-close").on("click", function () {
                    $(".search-bar").removeClass("full-search-bar")
                })
        });


    }

    logout() {
        this.api.logout();
    }


}
