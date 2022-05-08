import type { Ref } from 'vue'

/* eslint-disable no-console */
export const web3Store = defineStore('web3', () => {
  const account: Ref<string | null> = ref(null)

  async function checkForWallet() {
    const { ethereum } = window
    if (!ethereum)
      return console.error('Get Metamask => https://metamask.io')

    console.log('You have Metamask Nice !', ethereum)

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const accountList = accounts[0]
      console.log('Found an authorized account:', account)
      account.value = accountList
    }
    else {
      console.log('No authorized account found')
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window

      if (!ethereum)
        return console.error('Get Metamask Sucker !!!')

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      account.value = accounts[0]
    }
    catch (error) {
      return console.error('Error :', error)
    }
  }

  return {
    account,
    checkForWallet,
    connectWallet,
  }
})
