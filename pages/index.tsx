import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Web3 Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <main>
      <Header/>
    </main>
      
    </div>
  )
}

export default Home
