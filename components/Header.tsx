import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {};

const Header = (props: Props) => {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();
  return (
    <div className="max-w-6xl mx-auto p-2">
      <nav className="flex justify-between ">
        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn ">
              Hi {address.slice(0, 4)}...{address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetaMask} className="connectWalletBtn ">
              Connect your Wallet
            </button>
          )}
          <p className="headerLink">Daily Deals</p>
          <p className="headerLink">Help & Contact</p>
        </div>
        <div className="flex  items-center space-x-4 text-sm">
          <p className="headerLink">Ship To</p>
          <p className="headerLink">Sell</p>
          <p className="headerLink">Watchlist</p>

          <Link href="/addItems" className="flex items-center hover:link">
            Add to Inventory <ChevronDownIcon className="h-4" />
          </Link>

          <BellIcon className="h-6 w-6" />
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
      </nav>

      <hr className="mt-2" />

      <section className="flex items-center space-x-2 py-5">
        <div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="ebay logo"
              src="https://links.papareact.com/bdb"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <button className="hidden lg:flex items-center space-x-2 w-20 focus:outline-none">
          <p className="text-gray-300 text-sm  ">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>

        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 rounded-full bg-zinc-700 flex-1">
          <MagnifyingGlassIcon className="w-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search for Anything"
            className="flex-1 outline-none bg-zinc-700 text-white placeholder-gray-300"
          />
        </div>

        <button className="hidden sm:inline bg-cus_blue text-white font-semibold px-5 md:px-10 py-2 border-2 border-cus_blue focus:outline-none active:scale-90  duration-200">
          Search
        </button>

        <Link href="/createListing">
          <button className="border-2  border-cus_blue px-4 md:px-10 py-2 text-cus_blue hover:bg-cus_blue/50 hover:text-white cursor-pointer font-semibold focus:outline-none active:scale-90  duration-200">
            List Item
          </button>
        </Link>
      </section>

      <hr />

      <section className="flex py-3 space-x-6 text-xs md:text-sm whitespace-nowrap justify-center px-6 ">
        <p className="link">Home</p>
        <p className="link">Electronics</p>
        <p className="link ">Other</p>
        <p className="link hidden sm:inline">Computers</p>
        <p className="link hidden sm:inline">Video Games</p>
        <p className="link hidden sm:inline">Health & Beauty</p>
        <p className="link hidden sm:inline">Books</p>
        <p className="link hidden sm:inline">Deals</p>
        <p className="link hidden lg:inline">Collectibles and Art</p>
        <p className="link hidden lg:inline">Music</p>
        <p className="link hidden lg:inline">Home & Garden</p>
      </section>
    </div>
  );
};

export default Header;
