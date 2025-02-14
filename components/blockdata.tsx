import { Block } from "@/types/light-client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  currentBlock: Block | null;
  running: Boolean;
  network: string;
};

export default function BlockData(props: Props) {

const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);

  const currentBlock = props.currentBlock;
  const running = props.running;
  return (
    <>
      <div className="flex flex-col w-full space-y-6 ml-6">
        <div className="flex flex-col space-y-2">
          {running && (
            <h2 className="text-white text-3xl font-thicccboisemibold 2xl:text-4xl pt-6 lg:pt-0 2xl:pt-4 ">
              Block data{" "}
              <span className="text-opacity-80 text-white font-thicccboisemibold 2xl:text-xl lg:text-lg text-sm">
                (Latest Block)
              </span>
            </h2>
          )}
        </div>
        <div className="flex flex-row justify-between lg:mr-4 items-start ">
          <div className="flex flex-col items-start">
            <HoverCard open={isHoverCardOpen} onOpenChange={setIsHoverCardOpen}>
              <HoverCardTrigger onClick={() => setIsHoverCardOpen(true)} className="text-[#F5F5F5] font-thicccboisemibold text-xl lg:text-2xl 2xl:text-2xl 2xl:mt-4 flex flex-row space-x-1">
                <span>Confidence Factor </span>
                <InfoIcon className="w-3 h-3" />
              </HoverCardTrigger>
              <HoverCardContent className="bg-[#141414] text-white border-[#121212] !text-sm ">
                How confident the LC is that all data is available.
              </HoverCardContent>
            </HoverCard>
            {currentBlock?.hasDaSubmissions ? (
              currentBlock.confidence && currentBlock.confidence > 90 ? (
                <p
                  className={`font-thicccboibold text-6xl xl:text-4xl 2xl:text-4xl 2xl:mt-2 ${
                    parseInt(currentBlock.confidence.toString().slice(0, 2)) >
                    85
                      ? "text-green-500"
                      : parseInt(
                          currentBlock.confidence.toString().slice(0, 2)
                        ) > 50
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {currentBlock?.confidence?.toString().slice(0, 4) || "0"}%
                </p>
              ) : (
                <p className="font-thicccboibold text-6xl xl:text-7xl 2xl:text-7xl 2xl:mt-2 text-green-500">
                  ...
                </p>
              )
            ) : (
              <p className="font-thicccboibold text-2xl xl:text-3xl 2xl:text-4xl 2xl:mt-2 text-yellow-500">
                No DA submissions
              </p>
            )}
             {currentBlock?.hasDaSubmissions && (
                <>
                  <div className="md:flex flex-col hidden mt-8">
                    <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-2xl 2xl:mt-4">
                      Sample Cell Count
                    </h3>
                    <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-2xl text-left">
                      {currentBlock?.sampleCount?.toString() || "0"}
                    </p>
                  </div>
                </>
              )}
          </div>
          <div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex flex-col ">
                <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-2xl 2xl:mt-4">
                  Blockhash
                </h3>
                <a
                  className="text-green-500 font-thicccboibold text-2xl 2xl:text-2xl text-right"
                  target="_blank" 
                  href={
                    props.network === "Mainnet"
                      ? `https://avail.subscan.io/block/${currentBlock?.number}`
                      : `https://avail-turing.subscan.io/block/${currentBlock?.number}`
                  }
                >
                  {currentBlock?.hash?.toString().slice(0, 5) || ""}...
                  {currentBlock?.hash?.toString().slice(-3)}
                </a>
              </div>
              <div className="flex flex-col ">
                <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-2xl 2xl:mt-4">
                  Block Number
                </h3>
                <a
                  className="text-green-500 font-thicccboibold text-3xl 2xl:text-2xl text-right"
                  target="_blank" 
                  href={
                    props.network === "Mainnet"
                      ? `https://avail.subscan.io/block/${currentBlock?.number}`
                      : `https://avail-turing.subscan.io/block/${currentBlock?.number}`
                  }
                >
                  #{currentBlock?.number || "0000"}
                </a>
              </div>
              {currentBlock?.hasDaSubmissions && (
                <>
                  <div className="flex flex-col ">
                    <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-2xl 2xl:mt-4">
                      Total Cell Count
                    </h3>
                    <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-2xl text-right">
                      {currentBlock?.totalCellCount || "000"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
