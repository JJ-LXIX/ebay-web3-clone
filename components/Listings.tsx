import React from "react";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {};

const Listings = (props: Props) => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const router = useRouter();

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  return (
    <main className="max-w-6xl mx-auto py-2 px-6">
      {loadingListings ? (
        <p className="text-center animate-pulse text-cus_blue">
          Loading Listings
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
          {listings?.map((listing) => (
            <div
              onClick={() => router.push(`/listing/${listing.id}`)}
              key={listing.id}
              className="flex  flex-col card hover:scale-105 transition-all duration-200 ease-out"
            >
              <div className="flex flex-1 flex-col pb-2 justify-center  items-center">
                <MediaRenderer
                  className="w-full lg:max-h-[10rem]"
                  src={listing.asset.image}
                />
              </div>

              <div className="pt-2 space-y-4">
                <div>
                  <h2 className="text-lg truncate">{listing.asset.name}</h2>
                  <hr />
                  <p className="truncate text-sm text-gray-300 mt-2 ">
                    {listing.asset.description}
                  </p>
                </div>

                <p>
                  <span className="font-bold mr-1">
                    {listing.buyoutCurrencyValuePerToken.displayValue}
                  </span>
                  {listing.buyoutCurrencyValuePerToken.symbol}
                </p>

                <div
                  className={`flex items-center space-x-1 justify-end text-sm font-bold border w-fit ml-auto p-2 rounded-lg text-white ${
                    listing.type === ListingType.Direct
                      ? "bg-cus_blue"
                      : "bg-cus_red"
                  }`}
                >
                  <p>
                    {listing.type === ListingType.Direct
                      ? "Buy Now"
                      : "Auction"}
                  </p>
                  {listing.type === ListingType.Direct ? (
                    <BanknotesIcon className="h-4" />
                  ) : (
                    <ClockIcon className="h-4" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Listings;
