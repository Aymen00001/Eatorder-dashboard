import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@sentry/angular-ivy';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.scss']
})
export class AddcompanyComponent implements OnInit {
  user: User;
  store: any[];
  selectedOption: any;
  ownerId: string ='';
  name: string ;
  address: string ;
  phoneNumber: string = '';
  countries: string[] =
  [ "1. Sole Proprietorship",
"2. Partnership",
"3. Limited Partnership (LP)",
"4. Limited Liability Partnership (LLP)",
"5. Corporation",
"6. Limited Liability Company (LLC)",
"7. Cooperative",
"8. Nonprofit Organization",
"9. Trust",
"10. Joint Venture",
"11. Franchise",
"12. Public Limited Company (PLC)",
"13. Private Limited Company (Ltd)",
"14. Sole Trader",
"15. Social Enterprise",
"16. Community Interest Company (CIC)",
"17. Professional Corporation",
"18. B-Corporation (B-Corp)",
"19. Holding Company",
"20. State-Owned Enterprise (SOE)",
"21. Mutual Company",
"22. Not-for-Profit Corporation",
"23. Foundation",
"24. Society",
"25. Special Purpose Vehicle (SPV)",
"26. General Partnership",
"27. Silent Partnership",
"28. Cooperative Corporation",
"29. Private Unlimited Company",
"30. Family Limited Partnership (FLP)",
"31. Professional Limited Liability Company (PLLC)",
"32. S Corporation",
"33. Public-Private Partnership (PPP)",
"34. Community Benefit Society",
"35. Investment Company",
"36. Municipal Corporation",
"37. Public Corporation",
"38. State-Owned Corporation",
"39. Employee Stock Ownership Plan (ESOP)",
"40. Statutory Corporation",
"41. Simplified Joint Stock Company (SAS)",
"42. Public Limited Company (SA)",
"43. General Partnership (SNC)",
"44. Limited Partnership by Shares (SCA)",
"45. Limited Liability Company (SARL)",
"46. Partnership Limited by Shares (SEP)",
"47. Cooperative Society of Production (SCOP)",
"48. Civil Society (SC)",
"49. Professional Services Company (SEL)",
"50. Variable Capital Investment Company (SICAV)",
"51. Partnership Limited by Shares (SCA)",
"52. Financial Company for Professional Liberale (SPFPL)",
"53. Listed Real Estate Investment Company (SIIC)",
"54. Variable Capital Investment Company (SICAF)",
"55. Cooperative Society of Collective Interest (SCIC)",
"56. Free Partnership (SLP)",
"57. Special Limited Partnership (SCSp)",
"58. Simplified Joint Stock Company with a Sole Shareholder (SASU)",
"59. Simplified Single-Person Limited Liability Company (SASU)",
"60. Single-Person Limited Liability Company (SARLU)",
"61. Worker Participation Company (SAPO)",
"62. Real Estate Investment Company with Variable Capital (SICAV immobilière)",
"63. Agricultural Grouping for Joint Exploitation (GAEC)",
"64. Agricultural Land Grouping (GFA)",
"65. Agricultural Land Company (GAF)",
"66. Economic Interest Group (GIE)",
"67. Association under the 1901 Law",
"68. Single-Person Limited Liability Company (EURL)"];
 companyData:any={};
 ownerrId:any;
 userr: User;
  constructor( private route: Router, private authService: ApiServices) {  }
  ngOnInit(): void {
    this.authService.getUberToken().subscribe(
      (response) => {
        const accessToken = response.accessToken;
        // Stockez le token dans le localStorage ou utilisez-le comme nécessaire
        localStorage.setItem('accessToken', accessToken);
       console.log("accessToken",accessToken)
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération du token :', error);
      }
    );
    this.authService.getUberToken2().subscribe(
      (response) => {
        const accessToken = response.accessToken;
        // Stockez le token dans le localStorage ou utilisez-le comme nécessaire
        localStorage.setItem('accessTokenn', accessToken);
       console.log("accessTokenn",accessToken)
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération du token :', error);
      }
    );
    const user = this.authService.getUser();
    if (user !== null) {
      this.user = user;
      this.ownerrId=user._id;
 } else { console.log("error"); }
 this.companyData={
  ownerId:"",
  name:"",
  address: {
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country_iso2: ""
  },
    phoneNumber:"",
  duns:"",
  email:"",
  website:"",
  legalstatus: "",
  image:""
}
this.getOwners()
  }
  messageErrors: { [key: string]: string } = {};
  messageerror: string = "";
  addCompany() {
    console.log(this.companyData)
    const requiredFields = {
      name: "Name",
      address: "Address",
      phoneNumber: "Phone Number",
      duns: "Duns",
      email: "Email",
      website: "Web Site",
      legalstatus: "Legal Status"
    };
    const emailPattern = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.messageErrors = {};
    for (const field in requiredFields) {
      if (!this.companyData[field]) { this.messageErrors[field] = `Please fill in the ${requiredFields[field]} field`; } }
  if (!emailPattern.test(this.companyData.email)) { this.messageErrors['email'] = 'Please enter a valid email address'; }
    const errorFields = Object.keys(this.messageErrors);
    if (errorFields.length > 0) {
      this.messageerror = `Please fill in the following fields: ${errorFields.map(field => requiredFields[field]).join(', ')}`;
      setTimeout(() => { this.messageerror = "";}, 2000);
    } else {
      const formData = new FormData();
      formData.append("ownerId", this.companyData.ownerId); 
      formData.append("name", this.companyData.name);
      formData.append("address", JSON.stringify(this.companyData.address));
      formData.append("phone_details", JSON.stringify(this.companyData.phoneNumber));
      formData.append("duns", this.companyData.duns);
      formData.append("email", this.companyData.email);
      formData.append("website", this.companyData.website);
      formData.append("legalstatus", this.companyData.legalstatus);
      formData.append("image", this.image);
      formData.append("banner", this.image2);

      this.authService.addCompany(formData).subscribe(
        (companyResponse) => {              this.route.navigateByUrl(`/company/allcompany`);
      },
        (companyError) => {  console.error('Error adding Company:', companyError); }
      );
    }
  }
  clearError(fieldName: string): void {
    this.messageErrors[fieldName] = '';
  }
  image: File | null = null;
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) { this.image = files[0]; } }
    image2: File | null = null;
    onImageChange2(event: any): void {
      const files = event.target.files;
      if (files.length > 0) { this.image2 = files[0]; } }
    owners:any[]=[]
    getOwners(): void {
      this.authService.getowners().subscribe(
        (response: any) => {
          this.owners = response.owners;        },
        (error: any) => {
          console.error(error);
        }
      );
    }
}
