/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import type { Block } from "@/types/light-client";

type Props = {
    progress: number
}


export default function Block(props: Props) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.progress)
    }, [props.progress])

    useEffect(() => {
        const interval = setInterval(() => {
            setValue((v) => (v >= 100 ? 100 : v + 10));
        }, 5000);

    }, []);
    return (
        <div className="">
            <div className="flex flex-row items-center justify-center">
                <img
                    src="/images/block.png"
                    alt="block"
                    className="lg:max-h-[150px] max-h-[110px] aspect-auto overflow-scroll overflow-y-auto"
                />
                <div className="">
                    <Progress className="bg-[#20232B]" aria-label="finalizing..." value={value} />
                </div>
            </div>
        </div>
    )
}
