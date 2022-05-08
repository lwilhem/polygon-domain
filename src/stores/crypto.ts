/* eslint-disable no-alert */
import type { Ref } from 'vue'
import { ethers } from 'ethers'
import contractAbi from '../../artifacts/contracts/Domains.sol/Domains.json'
/* eslint-disable no-console */
export const web3Store = defineStore('web3', () => {
  const account: Ref<string | null> = ref(null)
  const domain: Ref<string> = ref('')
  const record: Ref<string> = ref('')
  const tld = '.Mclub'
  const CONTRACT_ADDRESS = '0x2e0d8927043500122505157CA2CA0b3Aba917caf'

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

  async function createDomain() {
    const name: string | undefined = domain.value
    if (!name)
      return console.error('Domain has to exists !!')

    if (name.length < 3)
      return alert('Domain must be at least 3 characters long')

    const price = name.length === 3 ? '0.5' : name.length === 4 ? '0.3' : '0.1'
    console.log('Minting domain', name, 'with price', price)

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer)

        console.log('Gas Ready...')

        let tx = await contract.register(name, { value: ethers.utils.parseEther(price) })
        const receipt = await tx.wait()
        if (receipt.status === 1) {
          console.log(`Domain minted! https://mumbai.polygonscan.com/tx/${tx.hash}`)
          tx = await contract.setRecord(domain, record)
          await tx.wait()

          console.log(`Record set! https://mumbai.polygonscan.com/tx/${tx.hash}`)
        }
        else {
          alert('Transaction failed! Please try again')
        }
      }
    }
    catch (error) {
      console.error('Mint', error)
    }
  }

  return {
    account,
    checkForWallet,
    connectWallet,

    tld,
    domain,
    record,
    createDomain,
  }
})
