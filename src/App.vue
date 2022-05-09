<script setup lang="ts">
import { web3Store } from './stores/crypto'
import { isDark } from '~/composables'

const store = web3Store()

useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
})

onMounted(() => {
  store.checkForWallet()
})

</script>

<template>
  <RouterView />
</template>
