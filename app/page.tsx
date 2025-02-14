"use client";

import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header";
import { useState, useEffect } from "react";
import init, { verify_cell } from "@/avail-light/pkg/wasm_avail_light";
import config from "../utils/config";
import { sleep } from "@/utils/helper";
import { Block, Matrix, Cell, BlockToProcess } from "@/types/light-client";
import { runLC } from "@/repository/avail-light.repository";
import React from "react";
import LogDisplay from "@/components/logs";
import Hero from "@/components/sections/hero";
import MacWindow from "@/components/macwindow";

export default function Home() {
  const [network, setNetwork] = useState("Turing");
  const [logs, setLogs] = useState<string[]>(["Initiating script"]);
  const [blocksToProcess, setblocksToProcess] = useState<Array<BlockToProcess>>(
    []
  );
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [blockList, setBlockList] = useState<Array<Block>>([]);
  const [matrix, setMatrix] = useState<Matrix>({
    maxRow: 0,
    maxCol: 0,
    verifiedCells: [],
    totalCellCount: 0,
  });
  const [running, setRunning] = useState<Boolean>(false);
  const [stop, setStop] = useState<Function | null>(null);
  const [processingBlock, setProcessingBlock] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setLogs(["Initiating script for " + network]);
  }, [network]);

  const refreshApp = () => {
    setRunning(true);
    setLogs(["Initiating script"]);
    setBlockList([]);
    setMatrix({ maxRow: 0, maxCol: 0, verifiedCells: [], totalCellCount: 0 });
    setCurrentBlock(null);
    setblocksToProcess([]);
  };

  useEffect(() => {
    if (!processingBlock && blocksToProcess.length > 0) {
      const blockToProcess: BlockToProcess = blocksToProcess[0];
      processBlock(
        blockToProcess.block,
        blockToProcess.matrix,
        blockToProcess.verifiedCells,
        blockToProcess.proofs,
        blockToProcess.commitments
      );
      setblocksToProcess((list: BlockToProcess[]) =>
        list.slice(1, list.length)
      );
    }
  }, [blocksToProcess, processingBlock]);

  const processBlock = async (
    block: Block,
    matrix: Matrix | null,
    cells: Cell[],
    proofs: Uint8Array[],
    commitments: Uint8Array[]
  ) => {
    console.debug("Processing block:", {
      blockNumber: block.number,
      hasDaSubmissions: block.hasDaSubmissions,
      totalCells: cells.length,
      matrixDimensions: matrix ? `${matrix.maxRow}x${matrix.maxCol}` : "null",
      verifiedCells: cells,
    });

    if (block.hasDaSubmissions && matrix) {
      setMatrix({
        maxRow: matrix.maxRow,
        maxCol: matrix.maxCol,
        verifiedCells: [],
        totalCellCount: matrix.totalCellCount,
      });
    }

    addNewBlock(block, matrix);
    setProcessingBlock(true);

    if (matrix && cells.length > 0) {
      let verifiedCount = 0;
      let verifiedCells: Cell[] = [];

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        try {
          const res = await verify_cell(
            proofs[i],
            commitments[cell.row],
            matrix.maxCol,
            cell.row,
            cell.col
          );

          if (res) {
            verifiedCount++;
            verifiedCells.push(cell);

            setCurrentBlock((prev) => {
              if (!prev) return null;
              return {
                network: prev.network,
                number: prev.number,
                hash: prev.hash,
                totalCellCount: prev.totalCellCount,
                sampleCount: prev.sampleCount,
                hasDaSubmissions: prev.hasDaSubmissions,
                confidence: 100 * (1 - 1 / Math.pow(2, verifiedCount)),
              };
            });

            setMatrix((prev) => ({
              ...prev,
              verifiedCells: [...verifiedCells],
            }));
          }

          await sleep(100);
        } catch (error) {
          console.error("Verification error:", error);
        }
      }
    }

    await sleep(500);
    setProcessingBlock(false);
  };

  const run = async (network: string) => {
    refreshApp();
    runLC(setblocksToProcess, setStop, network, logs, setLogs);
  };

  const scrollToBlocks = () => {
    setTimeout(
      () =>
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        }),
      500
    );
  };

  const handleNetworkSwitch = async (newNetwork: string) => {
    setNetwork(newNetwork);
    setLogs([...logs, `Switching to ${newNetwork} network`]);
    if (running) {
      await stop?.();
      run(newNetwork);
    }
  };

  const addNewBlock = (newBlock: Block, matrix: Matrix | null) => {
    setCurrentBlock(newBlock);
    if (matrix) {
      setMatrix({
        maxRow: matrix.maxRow,
        maxCol: matrix.maxCol,
        verifiedCells: [],
        totalCellCount: matrix.totalCellCount,
      });
    } else {
      setMatrix({
        maxRow: 0,
        maxCol: 0,
        verifiedCells: [],
        totalCellCount: 0,
      });
    }

    setBlockList((list) => {
      let newBlockList: Block[] = [];
      for (
        let i = list.length - 1;
        i >= 0 && i > list.length - config.BLOCK_LIST_SIZE;
        i--
      ) {
        newBlockList.push(list[i]);
      }
      newBlockList.reverse();
      newBlockList.push(newBlock);
      return newBlockList;
    });
  };

  return (
    <MacWindow title={`Avail Light Client - ${network}`}>
      {/** Navbar with buttons and switcher */}
      <Navbar
        showButton
        button={
          <Button
            onClick={() => {
              running ? (stop?.(), setRunning(false)) : run(network);
            }}
            variant={"outline"}
            className="text-white rounded-full border-opacity-70 bg-opacity-50 lg:px-8 lg:py-6 px-6 py-4 font-thicccboibold"
          >
            {running ? "Stop Running the LC" : "Start Running the LC"}
          </Button>
        }
        networkSwitcher={
          <div className="flex items-center space-x-2 rounded-full border-white border-opacity-10 border-2 ">
            <Button
              onClick={() => handleNetworkSwitch("Turing")}
              variant={"outline"}
              className={`${
                network === "Turing"
                  ? "bg-white bg-opacity-10 hover:!bg-white hover:!bg-opacity-10"
                  : "hover:!bg-inherit"
              } border-0 !text-white rounded-full lg:px-8 lg:py-6 px-6 py-4 font-thicccboibold`}
            >
              Turing
            </Button>
            <Button
              onClick={() => handleNetworkSwitch("Mainnet")}
              variant={"outline"}
              className={`${
                network === "Mainnet"
                  ? "bg-white bg-opacity-10 hover:!bg-white hover:!bg-opacity-10"
                  : "hover:!bg-inherit"
              }  border-0 !text-white rounded-full  lg:px-8 lg:py-6 px-6 py-4 font-thicccboibold`}
            >
              Mainnet
            </Button>
          </div>
        }
      />
      <main className="">
        {/** start lc button for mobile only */}
        <div className="md:hidden flex flex-col items-center justify-center py-8">
          <Button
            onClick={() => {
              running
                ? (stop?.(), setRunning(false))
                : (run(network), scrollToBlocks());
            }}
            variant={"outline"}
            className="text-white rounded-full border-opacity-70 bg-opacity-50 px-8 py-6  font-thicccboibold"
          >
            {running ? "Stop Running the LC" : "Start Running the LC"}
          </Button>
        </div>
        {/** core components */}
        {running && currentBlock != null ? (
          <div className="flex lg:flex-row flex-col-reverse lg:h-screen w-full">
            <div className="lg:w-[50%] flex flex-col pt-10" id="blocks-section">
              <DsMatrix
                matrix={matrix}
                processing={processingBlock}
                hasDaSubmissions={currentBlock.hasDaSubmissions}
                blockNumber={currentBlock.number}
                network={network}
              />
            </div>
            <div className="lg:w-[50%] flex items-start lg:mt-10">
              <div className="flex flex-col w-[90%] space-y-10 items-start justify-start">
                <div className="lg:h-[20%] 2xl:h-[25%] min-h-[50px] flex flex-col items-start justify-start mt-10">
                  <AvailChain blockList={blockList} network={network} />
                </div>
                <LogDisplay logs={logs} />
                <BlockData
                  currentBlock={currentBlock}
                  running={running}
                  network={network}
                />
              </div>
            </div>
          </div>
        ) : (
          <Hero running={running} currentBlock={currentBlock} />
        )}
      </main>
    </MacWindow>
  );
}
