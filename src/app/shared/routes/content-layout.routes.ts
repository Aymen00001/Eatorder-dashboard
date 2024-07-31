import { Routes } from '@angular/router';
import { AuthGuardLoggedOut } from 'src/app/services/AuthGuardLoggedOut';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
    {
        path: 'error',
        loadChildren: () => import('./../../error/error.module').then(m => m.ErrorModule)
    },
    {
        path: 'auth',
        canActivate:[AuthGuardLoggedOut],
        loadChildren: () => import('./../../auth/auth.module').then(m => m.AuthModule)
    }
];