<script setup lang="ts">
import { web3Store } from './stores/crypto'
import { isDark } from '~/composables'

const store = web3Store()

useHead({
  title: 'On The Mints !',
  meta: [
    { name: 'description', content: 'ENS But cheaper and worse' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
})

onMounted(() => {
  store.checkForWallet()
  if (store.network === 'Polygon Mumbai Testnet')
    store.findAllDomains()
})

</script>

<template>
  <RouterView />
</template>
