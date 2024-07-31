import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/AuthGuard';


//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
    {
        path: 'dashboard',
        canActivate:[AuthGuard],
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'application',
    
        loadChildren: () => import('../../application/application.module').then(m => m.ApplicationModule)

    },
    {
        path: 'store',
    
        loadChildren: () => import('../../owner/store/store.module').then(m => m.StoreModule)

    },
    {
        path: 'company',
        loadChildren: () => import('../../admin/company/company.module').then(m => m.CompanyModule)
    },
    {
        path: 'users',
     canActivate:[AuthGuard],
        data: {
            role: 'admin'
          },
       
        loadChildren: () => import('../../admin/users/users.module').then(m => m.UsersModule)

    },
    {
        path: 'pos',
        loadChildren: () => import('../../owner/pos/pos.module').then(m => m.PosModule)

    },
    {
        path: 'tax',
        loadChildren: () => import('../../owner/tax/tax.module').then(m => m.TaxModule)

    },
    {
        path: 'orders',
        loadChildren: () => import('../../owner/orders/orders.module').then(m => m.OrdersModule)

    },
    {
        path: 'menu',
        loadChildren: () => import('../../owner/menu-setup/menu-setup.module').then(m => m.MenuSetupModule)

    },
    {
        path: 'store',
        loadChildren: () => import('../../owner/store/store.module').then(m => m.StoreModule)

    },
    {
        path: 'category',
        loadChildren: () => import('../../owner/category/category.module').then(m => m.CategoryModule)

    },
    {
        path: 'product',
        loadChildren: () => import('../../owner/product/product.module').then(m => m.ProductModule)

    },
      {
        path: 'ordremode',
        loadChildren: () => import('../../owner/ordremode/ordremode.module').then(m => m.OrdremodeModule)

    },
    {
        path: 'banner',
        loadChildren: () => import('../../banner/banner.module').then(m => m.BannerModule)

    },
    {
        path: 'stores',
        loadChildren: () => import('../../admin/stores/stores.module').then(m => m.StoresModule)

    },
    {
        path: 'widgets',
        loadChildren: () => import('../../widgets/widgets.module').then(m => m.WidgetsModule)

    },
    {
        path: 'ecommerce',
        loadChildren: () => import('../../ecommerce/ecommerce.module').then(m => m.EcommerceModule)

    },
    {
        path: 'components',
        loadChildren: () => import('../../components/components.module').then(m => m.ComponentsModule)
    },
    {
        path: 'ng-components',
        loadChildren: () => import('../../ng-components/ng-components.module').then(m => m.NgComponentsModule)
    },
    {
        path: 'content',
        loadChildren: () => import('../../content/content.module').then(m => m.ContentModule)
    },
    {
        path: 'icons',
        loadChildren: () => import('../../icons/icons.module').then(m => m.IconsModule)
    },
    {
        path: 'form',
        loadChildren: () => import('../../form/form.module').then(m => m.FormModule)
    },
    {
        path: 'table',
        loadChildren: () => import('../../table/table.module').then(m => m.TableModule)

    },
    {
        path: 'user-profile',
        loadChildren: () => import('../../user-profile/user-profile.module').then(m => m.UserProfileModule)

    },
    {
        path: 'faq',
        loadChildren: () => import('../../faq/faq.module').then(m => m.FaqModule)
    },
    {
        path: 'pricing',
        loadChildren: () => import('../../pricing/pricing.module').then(m => m.PricingModule)
    },
    {
        path: 'earnings',
        canActivate:[AuthGuard],
        data: {
            role: 'admin'
          },
        loadChildren: () => import('../../earnings/earnings.module').then(m => m.EarningsModule)
    },
    {
        path: 'downloads',
        loadChildren: () => import('../../downloads/downloads.module').then(m => m.DownloadsModule)
    },
    {
        path: 'timeline',
        loadChildren: () => import('../../timeline/timeline.module').then(m => m.TimelineModule)
    },
    {
        path: 'charts',
        loadChildren: () => import('../../charts/chart.module').then(m => m.ChartModule)
    },
    {
        path: 'maps',
        loadChildren: () => import('../../maps/maps.module').then(m => m.MapsModule)

    },
    {
        path: 'options',
        loadChildren: () => import('../../owner/options/options.module').then(m => m.OptionsModule)

    }
];