import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Listings from "../components/Listings";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Web3 Ebay Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Content */}
      <Header />
      <Listings />
    </div>
  );
};

export default Home;
