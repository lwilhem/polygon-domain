/* eslint-disable no-alert */
/* eslint-disable no-console */
import type { Ref } from 'vue'
import { ethers } from 'ethers'
import { networks } from '../utils/networks'
import contractABI from '../utils/abi/Domains.json'
const CONTRACT_ADDRESS = '0xa83f7c55Df9AFA9e34aB2AC038e3c6D3BB9bD8C3'

export const web3Store = defineStore('web3', () => {
  const account: Ref<string | null> = ref(null)
  const domain: Ref<string> = ref('')
  const record: Ref<string> = ref('')
  const network = ref('')
  const loading = ref(false)

  interface mintList {
    id: any
    name: any
    record: any
    owner: any
  }

  const mints: Ref<mintList[] | undefined> = ref()

  const tld = '.Mclub'

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

      await findAllDomains()
    }
    else {
      console.log('No authorized account found')
    }

    const chainId = await ethereum.request({ method: 'eth_chainId' })
    // eslint-disable-next-line no-unused-expressions
    network.value = (networks[`${chainId}`])

    ethereum.on('chainChanged', handleChainChanged)

    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer)

    console.log(contract.getAllNames())

    // Reload the page when they change networks
    function handleChainChanged(_chainId: any) {
      window.location.reload()
    }
  }

  async function withdraw() {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer)

      await contract.withdraw()
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

    setLoader(true)
    const price = name.length === 3 ? '0.5' : name.length === 4 ? '0.3' : '0.1'
    console.log('Minting domain', name, 'with price', price)

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer)

        console.log('Gas Ready...')

        let tx = await contract.register(name, { value: ethers.utils.parseEther(price) })
        const receipt = await tx.wait()
        if (receipt.status === 1) {
          console.log(`Domain minted! https://mumbai.polygonscan.com/tx/${tx.hash}`)
          tx = await contract.setRecord(domain.value, record.value)
          await tx.wait()

          console.log(`Record set! https://mumbai.polygonscan.com/tx/${tx.hash}`)

          domain.value = ''
          record.value = ''
        }
        else {
          alert('Transaction failed! Please try again')
        }
      }
      setLoader(false)
    }
    catch (error) {
      setLoader(false)
      console.error('Mint', error)
    }
  }

  async function findAllDomains() {
    setLoader(true)
    try {
      const { ethereum } = window
      if (ethereum) {
        // You know all this
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer)

        // Get all the domain names from our contract
        const names = await contract.getAllNames()

        // For each name, get the record and the address
        const mintRecords = await Promise.all(names.map(async (name) => {
          const mintRecord = await contract.records(name)
          const owner = await contract.domains(name)
          return {
            id: names.indexOf(name),
            name,
            record: mintRecord,
            owner,
          }
        }))

        console.log('MINTS FETCHED ', mintRecords)
        mints.value = mintRecords
        setLoader(false)
      }
    }
    catch (error) {
      setLoader(false)
      console.log(error)
    }
  }

  function setLoader(value: boolean) {
    console.log('setloader', value)
    loading.value = value
  }

  return {
    account,
    checkForWallet,
    connectWallet,
    mints,

    tld,
    domain,
    record,
    createDomain,

    network,
    findAllDomains,
    withdraw,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(web3Store, import.meta.hot))
