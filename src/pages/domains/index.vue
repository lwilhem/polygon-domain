<script setup lang="ts">
import { web3Store } from '../../stores/crypto'

const store = web3Store()
const { domain, record } = storeToRefs(store)
</script>

<template>
  <section class="w-full my-5 h-fit grid grid-cols-2 grid-rows-1 rounded-2 gap-5">
    <object data="assets/form-input.svg" class="col-start-1 bg-indigo-500 mx-4 col-end-2 w-full p-10 rounded-4" />
    <div class="col-start-2 col-end-3 bg-zinc-900 mx-4 flex flex-col p-10 rounded-4">
      <input v-model="domain" type="text" placeholder="Domain">
      <input v-model="record" type="text" placeholder="Records">
      <button class="bg-slate-200 text-zinc-900" @click="store.createDomain()">
        Mint Your Domain
      </button>
    </div>
  </section>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
