<script setup lang="ts">
import { web3Store } from '../stores/crypto'
import { toggleDark } from '~/composables'

const { account } = web3Store()
const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
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
      <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>

      <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales">
        <div i-carbon-language />
      </a>

      <RouterLink class="icon-btn mx-2" to="/about" :title="t('button.about')">
        <div i-carbon-dicom-overlay />
      </RouterLink>

      <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank" title="GitHub">
        <div i-carbon-logo-github /></a>
    </nav>
    <div v-if="account" class="flex items-center dark:bg-red-500 justify-center bg-indigo-500 text-slate-200 px-4 py-2 rounded-3">
      <div class="i-cryptocurrency:matic" w-8 h-8 />
      <span class="px-2">{{ account.slice(0, 6) }}...{{ account.slice(-4) }}</span>
    </div>
  </header>
</template>
