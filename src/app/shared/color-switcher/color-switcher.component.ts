import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-color-switcher',
  templateUrl: './color-switcher.component.html',
  styleUrls: ['./color-switcher.component.scss']
})
export class ColorSwitcherComponent implements OnInit {

  constructor(private translate: TranslateService, private location: Location) { }

  ngOnInit() {
/*
    $(".switcher-btn").on("click", function() {
      $(".switcher-wrapper").toggleClass("switcher-toggled")
    }), $(".close-switcher").on("click", function() {
      $(".switcher-wrapper").removeClass("switcher-toggled")
    }), $("#lightmode").on("click", function() {
      $("html").attr("class", "light-theme")
    }), $("#darkmode").on("click", function() {
      $("html").attr("class", "dark-theme")
    }), $("#semidark").on("click", function() {
      $("html").attr("class", "semi-dark")
    }), $("#minimaltheme").on("click", function() {
      $("html").attr("class", "minimal-theme")
    }), $("#headercolor1").on("click", function() {
      $("html").addClass("color-header headercolor1"), $("html").removeClass("headercolor2 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor2").on("click", function() {
      $("html").addClass("color-header headercolor2"), $("html").removeClass("headercolor1 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor3").on("click", function() {
      $("html").addClass("color-header headercolor3"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor4").on("click", function() {
      $("html").addClass("color-header headercolor4"), $("html").removeClass("headercolor1 headercolor2 headercolor3 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor5").on("click", function() {
      $("html").addClass("color-header headercolor5"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor3 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor6").on("click", function() {
      $("html").addClass("color-header headercolor6"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor3 headercolor7 headercolor8")
    }), $("#headercolor7").on("click", function() {
      $("html").addClass("color-header headercolor7"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor3 headercolor8")
    }), $("#headercolor8").on("click", function() {
      $("html").addClass("color-header headercolor8"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor3")
    })
    
    // sidebar colors 


 

    $("#sidebarcolor1").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor1");
      localStorage.setItem("sidebarColor", "sidebarcolor1");
    });

    $("#sidebarcolor2").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor2");
      localStorage.setItem("sidebarColor", "sidebarcolor2");
    });

    $("#sidebarcolor3").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor3");
      localStorage.setItem("sidebarColor", "sidebarcolor3");
    });

    $("#sidebarcolor4").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor4");
      localStorage.setItem("sidebarColor", "sidebarcolor4");
    });

    $("#sidebarcolor5").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor5");
      localStorage.setItem("sidebarColor", "sidebarcolor5");
    });

    $("#sidebarcolor6").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor6");
      localStorage.setItem("sidebarColor", "sidebarcolor6");
    });

    $("#sidebarcolor7").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor7");
      localStorage.setItem("sidebarColor", "sidebarcolor7");
    });

    $("#sidebarcolor8").on("click", function() {
      $("html").attr("class", "color-sidebar sidebarcolor8");
      localStorage.setItem("sidebarColor", "sidebarcolor8");
    });


    const storedColor = localStorage.getItem("sidebarColor");
    if (storedColor) {
      $("html").attr("class", "color-sidebar " + storedColor);
    }



    function theme1() {
      $('html').attr('class', 'color-sidebar sidebarcolor1');
    }

    function theme2() {
      $('html').attr('class', 'color-sidebar sidebarcolor2');
    }

    function theme3() {
      $('html').attr('class', 'color-sidebar sidebarcolor3');
    }

    function theme4() {
      $('html').attr('class', 'color-sidebar sidebarcolor4');
    }
	
	function theme5() {
      $('html').attr('class', 'color-sidebar sidebarcolor5');
    }
	
	function theme6() {
      $('html').attr('class', 'color-sidebar sidebarcolor6');
    }

    function theme7() {
      $('html').attr('class', 'color-sidebar sidebarcolor7');
    }

    function theme8() {
      $('html').attr('class', 'color-sidebar sidebarcolor8');
    }
	
	*/
  }
 /* switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('', lang);
    this.location.go(this.location.path());
    window.location.reload();

  }
*/
}
