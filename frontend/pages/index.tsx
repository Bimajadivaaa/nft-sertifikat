import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "../contract-abi";
import FlipCard, { BackCard, FrontCard } from "../components/FlipCard";
import Head from "next/head";

const contractConfig = {
  address: "0x04598e50d75c5cf408Fd2f8A7cDBa1e0825F34ee",
  abi,
} as const;

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const { isConnected } = useAccount();

  const {
    data: hash,
    writeContract: mint,
    isPending: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useWriteContract();

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  const IPFS = "ipfs://QmdD4yv96mKTG3HWaGxjfmLhsFs9DRUeWDiC9K94rj56p3";
  const valueInWei = BigInt(100000000000000);
  const isMinted = txSuccess;

  return (
    <div className="page">
      <Head>
        <title>NFT Mint Certificate</title>
      </Head>
      <div className="container">
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ padding: "24px 24px 24px 0" }}>
            <p style={{ fontWeight: "bold", fontSize: "30px" }}>
              Selamat datang di Minting NFT Certificate
            </p>
            <p style={{ margin: "12px 0 24px" }}>
              Mint Sertifikat Kamu disini!
            </p>
            <p style={{ margin: "10px 0 10px" }}>
              Belum Punya Sepolia?{" "}
              <a
                style={{ color: "blue" }}
                href="https://www.alchemy.com/faucets/ethereum-sepolia"
              >
                Claim disini
              </a>
            </p>
            <ConnectButton />

            {mintError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {txError.message}
              </p>
            )}

            {mounted && isConnected && !isMinted && (
              <button
                style={{ marginTop: 15, cursor: "pointer" }}
                disabled={!mint || isMintLoading || isMintStarted}
                className="button"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() =>
                  mint?.({
                    ...contractConfig,
                    functionName: "mint",
                    args: [IPFS.toString()],
                    value: valueInWei,
                  })
                }
              >
                {!isMintLoading && !isMintStarted && "Mint"}
                {isMintLoading && "Waiting for approval"}
                {isMintStarted && "Minting..."}
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <FlipCard>
            <FrontCard isCardFlipped={isMinted}>
              <Image
                layout="responsive"
                src="/nft-certificate.png"
                width="500"
                height="500"
                alt="RainbowKit Demo NFT"
                style={{ borderRadius: 10 }}
              />
              {/* <h1 style={{ marginTop: 24 }}>Rainbow NFT</h1> */}
              {/* <ConnectButton /> */}
            </FrontCard>
            <BackCard isCardFlipped={isMinted}>
              <div style={{ padding: 24 }}>
                <Image
                  src="/nft-certificate.png"
                  width="80"
                  height="80"
                  alt="RainbowKit Demo NFT"
                  style={{ borderRadius: 10 }}
                />
                <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
                <p style={{ marginBottom: 24 }}>
                  Your NFT will show up in your wallet in the next few minutes.
                </p>
                <p style={{ marginBottom: 6 }}>
                  View on{" "}
                  <a href={`https://sepolia.etherscan.io/tx/${hash}`}>
                    Etherscan
                  </a>
                </p>
                <p>
                  View on{" "}
                  <a
                    href={`https://testnets.opensea.io/assets/sepolia/${txData?.to}/1`}
                  >
                    Opensea
                  </a>
                </p>
              </div>
            </BackCard>
          </FlipCard>
        </div>
      </div>
    </div>
  );
};

export default Home;
