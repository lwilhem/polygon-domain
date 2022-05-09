<script setup lang="ts">
import { web3Store } from '../stores/crypto'
import { toggleDark } from '~/composables'

const { account } = web3Store()
</script>

<template>
  <header class="w-full h-16 flex items-center justify-between px-6">
    <RouterLink to="/" class="flex items-center justify-center">
      <div class="i-mdi:glass-cocktail w-10 h-10" dark:bg-red-500 />
      <h1 class="font-mono text-2xl">
        On The Mints !
      </h1>
    </RouterLink>
    <nav text-xl class="flex items-center justify-center">
      <button class="icon-btn mx-2 !outline-none" :title="('button.toggle_dark')" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>

      <a href="https://testnets.opensea.io/collection/the-mebar-thzjy3xqzi" class="icon-btn mx-2">
        <div class="i-carbon:list" w-8 h-8 />
      </a>

      <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/lwilhem/polygin-domain" target="_blank" title="GitHub">
        <div i-carbon-logo-github />
      </a>
    </nav>
    <div v-if="account" class="flex items-center dark:bg-red-500 justify-center bg-indigo-500 text-slate-200 px-4 py-2 rounded-3">
      <div class="i-cryptocurrency:matic" w-8 h-8 />
      <span class="px-2">{{ account.slice(0, 6) }}...{{ account.slice(-4) }}</span>
    </div>
  </header>
</template>
