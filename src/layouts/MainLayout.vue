<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Farmacias Estrella </q-toolbar-title>
        <div>v0.9</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Menú </q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    caption: '',
    icon: 'dashboard',
    link: 'dashboard',
  },
  {
    title: 'Corte de caja',
    caption: '',
    icon: 'money',
    link: 'cashClosing',
  },
  {
    title: 'Mercado Pago',
    caption: '',
    icon: 'payment',
    link: 'mercadoPago',
  },
  {
    title: 'Comparar precios',
    caption: 'Compara precios de provedores',
    icon: 'barcode_reader',
    link: 'comparatorPrices',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
