import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Countdown from "react-countdown";
import {
  useContract,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  MediaRenderer,
  useAddress,
  useListing,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import network from "../../utils/network";
import { ethers } from "ethers";

type Props = {};

const ListingPage = (props: Props) => {
  const router = useRouter();

  const [bidAmount, setBidAmount] = useState("");
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const { listingId } = router.query as { listingId: string };
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const address = useAddress();
  const { mutate: makeBid } = useMakeBid(contract);
  const { data: listing, isLoading, error } = useListing(contract, listingId);
  const { mutate: makeOffer } = useMakeOffer(contract);
  const { mutate: buyNow } = useBuyNow(contract);
  const { data: offers } = useOffers(contract, listingId);
  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  // console.log(minimumNextBid);

  const fetchMinNextBid = async () => {
    if (!listing || !contract) return;
    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    );

    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
    }
  };

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
  };

  const createBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      if (!listingId || !contract || !listing) return;

      await buyNow(
        {
          id: listingId,
          buyAmount: 1,
          type: listing.type,
        },
        {
          onSuccess(data, variables, context) {
            alert("NFT bought successfully");
            console.log("Success", data, variables, context);
            router.replace("/");
          },
          onError(error, variables, context) {
            alert("ERROR: NFT could not be bought");
            console.log("ERROR", error, variables, context);
          },
        }
      );

      // Direct Listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }
        console.log("Buyout price was not met, making offer...");
        await makeOffer(
          {
            quantity: 1,
            listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Offer made successfully");
              console.log("Success", data, variables, context);
              setBidAmount("");
            },
            onError(data, variables, context) {
              alert("Error: Offer could not be made");
              console.log("Error", error, variables, context);
            },
          }
        );
      }
      // Auction Listing
      if (listing?.type === ListingType.Auction) {
        console.log("Making Bid...");
        await makeBid(
          {
            listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Bid was made successfully!");
              console.log("Success", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("Error : Bid could not be made");
              console.log("Error", error, variables, context);
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Header />
        <div>
          <p className="text-cus_blue animate-pulse text-center">
            Loading Item...
          </p>
        </div>
      </div>
    );

  if (!listing) {
    return <div>Listing not Found</div>;
  }

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto  p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing?.asset.image} />
        </div>

        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-zinc-400">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller: </span>
              {listing.sellerAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p className="">
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>

            <p className="font-bold">Buy it Now:</p>
            <p className="text-3xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>

            <button
              onClick={createBidOrOffer}
              className="bg-cus_blue col-start-2 mt-2 font-bold rounded-full w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>

          {/* Listing Offers */}
          {listing.type === ListingType.Direct && offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold">Offers:</p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>

              {offers.map((offer) => (
                <>
                  <p>
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offeror.slice(0, 5) +
                      "..." +
                      offer.offeror.slice(-5)}
                  </p>
                  <div>
                    <p
                      className="text-sm italic"
                      key={
                        offer.listingId +
                        offer.offeror +
                        offer.totalOfferAmount.toString()
                      }
                    >
                      {ethers.utils.formatEther(offer.totalOfferAmount)}
                      {""}
                      {NATIVE_TOKENS[network].symbol}
                    </p>
                    {listing.sellerAddress === address && (
                      <button
                        onClick={() => {
                          acceptOffer(
                            { listingId, addressOfOfferor: offer.offeror },
                            {
                              onSuccess(data, variables, context) {
                                alert("Offer accepted successfully");
                                console.log(
                                  "Success",
                                  data,
                                  variables,
                                  context
                                );
                                router.replace("/");
                              },
                              onError(error, variables, context) {
                                alert("ERROR : Offer could not be accepted");
                                console.log("Error", error, variables, context);
                              },
                            }
                          );
                        }}
                        className="p-2 w-32 bg-cus_red/75 rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          {/*  */}
          <div className="grid grid-cols-2 spacey-y-2 items-center justify-end">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>

            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p>
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                </p>
                <p>Time Remaining</p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}

            <input
              className="border p-2 rounded-lg mr-5 bg-zinc-800"
              type="text"
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={formatPlaceholder()}
            />
            <button
              onClick={createBidOrOffer}
              className={`bg-cus_red font-bold rounded-full w-44 py-4 px-10`}
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ListingPage;
