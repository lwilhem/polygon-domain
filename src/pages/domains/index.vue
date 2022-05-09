<script setup lang="ts">
import { web3Store } from '../../stores/crypto'

const store = web3Store()
const { domain, record } = storeToRefs(store)
</script>

<template>
  <section class="w-full my-5 h-fit grid grid-cols-2 grid-rows-1 rounded-2 gap-5">
    <object data="assets/form-input.svg" class="col-start-1 bg-indigo-500 mx-4 col-end-2 w-full p-10 rounded-4" />
    <div class="col-start-2 col-end-3 bg-zinc-900 mx-4 flex flex-col p-10 rounded-4">
      <h3 class="text-slate-200 text-3xl my-3">
        MINT YOUR DOMAIN
      </h3>
      <div class="flex flex-col items-start">
        <label for="domain" class="text-slate-200 font-mono text-2xl flex items-center justify-center my-4">
          <div class="i-carbon:text-creation mr-4" /> Your Domain !
        </label>
        <div class="bg-slate-200 flex items-center justify-between w-full p-2 rounded-2 mb-8">
          <input v-model="domain" type="text" placeholder="Domain" class="w-full bg-slate-200 focus:outline-none">
          <p class="font-sans uppercase font-700">
            {{ store.tld }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-start">
        <label for="domain" class="text-slate-200 font-mono text-2xl flex items-center justify-center my-4">
          <div class="i-carbon:text-creation mr-4" /> For the Record !
        </label>
        <div class="bg-slate-200 flex items-center justify-between w-full p-2 rounded-2 mb-8">
          <input v-model="record" type="text" placeholder="For the record !" class="w-full bg-slate-200 focus:outline-none">
        </div>
      </div>
      <button class="bg-indigo-500 text-slate-200 h-16 font-mono uppercase text-xl rounded-2 mt-7" @click="store.createDomain()">
        Mint Your Domain
      </button>
    </div>
  </section>
  <div>
    <p v-for="data in store.mints" :key="data.id">
      {{ data }}
    </p>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
