"use client"
import React, {useCallback, useRef, useState} from "react";
import FortunesAlgorithm from "~/core/FortunesAlgorithm";
import Display from "~/components/Display";
import Rectangle from "~/core/types/Rectangle";
import {sites} from "../../data/testData";


const boundingBox = new Rectangle(0, 0, 800, 800)


const MainPage = () => {
    const [directrix, setDirectrix] = useState<number>(0)
    const timer = useRef<number | null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const algorithm = new FortunesAlgorithm(sites)
    algorithm.run(directrix)
    algorithm.diagram.bind(boundingBox)

    const setPlaying = useCallback((playing: boolean) => {
        if (playing) {
            timer.current = window.setInterval(() => {
                setDirectrix(directrix => directrix + 1)
            }, 100)
        } else {
            if (timer.current) {
                window.clearInterval(timer.current)
            }
        }
    }, [directrix])

    return (
        <div>
            <span>{directrix}</span>
            <button className="w-20 h-8 border rounded float-right" onClick={() => setPlaying(true)}>Play</button>
            <button className="w-20 h-8 border rounded float-right" onClick={() => {
                setDirectrix(0);
                setPlaying(false)
            }}>Reset
            </button>
            <button className="w-20 h-8 border rounded float-right" onClick={() => {
                setDirectrix(directrix + 10);
                setPlaying(false)
            }}>+10
            </button>
            <button className="w-20 h-8 border rounded float-right" onClick={() => {
                setDirectrix(directrix + 1);
                setPlaying(false)
            }}>+1
            </button>
            <button className="w-20 h-8 border rounded float-right" onClick={() => {
                setDirectrix(directrix - 1);
                setPlaying(false)
            }}>-1
            </button>
            <button className="w-20 h-8 border rounded float-right" onClick={() => {
                setDirectrix(directrix - 10);
                setPlaying(false)
            }}>-10
            </button>
            <Display diagram={algorithm.diagram} beachline={algorithm.beachline} directrix={directrix}
                     boundingBox={boundingBox}/>
        </div>
    );
}

export default MainPage