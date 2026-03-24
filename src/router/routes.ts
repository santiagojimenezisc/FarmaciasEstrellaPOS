import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'dashboard',
      },
      {
        path: 'corte-de-caja',
        component: () => import('pages/CashClosing.vue'),
        name: 'cashClosing',
      },
      {
        path: 'mercado-pago',
        component: () => import('pages/MercadoPago.vue'),
        name: 'mercadoPago',
      },
      {
        path: 'comparador-precios',
        component: () => import('pages/ComparatorPrices.vue'),
        name: 'comparatorPrices',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
