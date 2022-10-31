import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type Props = {};

const Header = (props: Props) => {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();
  return (
    <div className="max-w-6xl mx-auto p-2">
      <nav className="flex justify-between">
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
        <div className="flex items-center space-x-4 text-sm">
          <p className="headerLink">Ship To</p>
          <p className="headerLink">Sell</p>
          <p className="headerLink">Watchlist</p>

          <Link href="/addItem" className="flex items-center hover:link">
            Add to Inventory <ChevronDownIcon className="h-4" />
          </Link>

          <BellIcon className="h-6 w-6" />
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
      </nav>
    </div>
  );
};

export default Header;
