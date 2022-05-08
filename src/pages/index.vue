<script setup lang="ts">
import { web3Store } from '../stores/crypto'

const cryptoStore = web3Store()
const { account } = storeToRefs(cryptoStore)
</script>

<template>
  <section class="w-full h-fit p-10 flex flex-col items-center">
    <object data="assets/login.svg" class=" h-128 w-256 rounded-2 bg-indigo-500 p-5" />
    <button v-if="!account" class="bg-zinc-900 text-slate-200 p-2 my-5 w-256 rounded-2" @click="cryptoStore.connectWallet()">
      Connect
    </button>
  </section>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
