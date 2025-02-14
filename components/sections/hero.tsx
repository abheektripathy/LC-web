import { Block } from "@/types/light-client";
import Link from "next/link";

export default function Hero({
  running,
  currentBlock,
}: {
  running: Boolean;
  currentBlock: Block | null;
}) {
  return (
    <>
      {running && currentBlock === null ? (
        <div className="flex items-center justify-center md:h-[80vh] h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:p-16 p-6 2xl:p-20 space-y-10 2xl:space-y-14 ">
          <h2 className="text-5xl 2xl:text-7xl font-thicccboibold leading-tight text-white !text-left lg:block ">
            Trustlessly Verify Avail
          </h2>
          <p className="text-xl font-ppmori  text-white !text-left lg:block text-opacity-80 ">
            Quickly and efficiently verify proofs from the{" "}
            <Link
              href={`https://www.availproject.org/`}
              className="text-[#3CBBF9] underline"
            >
              Avail data availability layer
            </Link>{" "}
            right inside your browser. Give end users guarantees with cryptographic certainty that
            published data is both available and in its original form.
          </p>
          <p className="text-lg  font-ppmori  text-white !text-left lg:block text-opacity-80 ">
            While most users cannot, or do not wish to run full nodes on their
            own devices, light clients are small enough to download and run on
            smartphones and in this case even a browser without relying on a centralized RPC provider or someone
            else’s full node. This can put <i>decentralized verification</i>{" "}
            into the palms of every user’s hand.
          </p>
          <p className="text-xl  2xl:text-2xl font-ppmori text-white !text-left lg:block text-opacity-80 ">
            Check us out on Twitter{" "}
            <Link
              href={"https://twitter.com/AvailProject"}
              className="text-[#3CBBF9]"
              target={"_blank"}
            >
              @AvailProject!
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
