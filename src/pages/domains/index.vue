<script setup lang="ts">
import { web3Store } from '../../stores/crypto'

const store = web3Store()
const { domain, record } = storeToRefs(store)
</script>

<template>
  <section class="w-full my-5 h-fit grid grid-cols-2 grid-rows-1 rounded-2 gap-5">
    <object data="assets/form-input.svg" class="col-start-1 bg-indigo-500 dark:bg-red-500 mx-4 col-end-2 w-full p-10 rounded-4" />
    <div class="col-start-2 col-end-3 bg-zinc-900 dark:bg-slate-200 mx-4 flex flex-col p-10 rounded-4">
      <h3 class="text-slate-200 text-3xl my-3 dark:text-zinc-900">
        MINT YOUR DOMAIN
      </h3>
      <div class="flex flex-col items-start">
        <label for="domain" class="text-slate-200 dark:text-zinc-900 font-mono text-2xl flex items-center justify-center my-4">
          <div class="i-carbon:text-creation mr-4" /> Your Domain !
        </label>
        <div class="bg-slate-200 flex dark:bg-gray-300 items-center justify-between w-full p-2 rounded-2 mb-8">
          <input v-model="domain" type="text" placeholder="Domain" class="dark:bg-gray-300 w-full bg-slate-200 focus:outline-none">
          <p class="font-sans uppercase font-700">
            {{ store.tld }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-start">
        <label for="domain" class=" text-slate-200 font-mono dark:text-zinc-900 text-2xl flex items-center justify-center my-4">
          <div class="i-carbon:text-creation mr-4" /> For the Record !
        </label>
        <div class="bg-slate-200 flex items-center justify-between w-full p-2 rounded-2 mb-8">
          <input v-model="record" type="text" placeholder="For the record !" class="w-full dark:bg-gray-300 bg-slate-200 focus:outline-none">
        </div>
      </div>
      <button class="bg-indigo-500 dark:bg-red-500 text-slate-200 dark:text-zinc-900 h-16 font-mono uppercase text-xl rounded-2 mt-7" @click="store.createDomain()">
        Mint Your Domain
      </button>
    </div>
  </section>
  <section class="flex py-12 flex-wrap toems-center justify-center my-12">
    <a v-for="mint in store.mints" :key="mint.id" :href="'https://testnets.opensea.io/assets/mumbai/0xa83f7c55Df9AFA9e34aB2AC038e3c6D3BB9bD8C3/' + mint.id" class="bg-indigo-500 flex items-start flex-col text-slate-200 dark:bg-red-500 dark:text-zinc-900 px-8 py-3 mx-6 rounded-3">
      <h4 class="font-mono py-2">{{ mint.name }}{{ store.tld }}</h4>
      <p class="text-base prose py-2 prose-truegray font-sans dark:text-slate-200">{{ mint.record }}</p>
      <span class="py-2">{{ mint.owner.slice(0, 6) }}...{{ mint.owner.slice(-3) }}</span>
      <div v-if="mint.owner === store.account" i-mdi:book-edit class="w-8 h-8" @click="store.updateDomain()" />
    </a>
  </section>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
