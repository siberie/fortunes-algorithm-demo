"use client"
import React, {useCallback, useMemo, useRef, useState} from "react";
import FortunesAlgorithm from "~/core/FortunesAlgorithm";
import Display from "~/components/Display";
import Rectangle from "~/core/types/Rectangle";
import type Site from "~/core/types/Site";
import {distanceSquared} from "~/utils/measure";

const boundingBox = new Rectangle(0, 0, 800, 800)

const MainPage = () => {
    const [directrix, setDirectrix] = useState<number>(0)
    const timer = useRef<number | null>(null)
    const [sites, setSites] = useState<Site[]>([])

    const addSite = useCallback((position: { x: number, y: number }) => {
        const newSite = {index: sites.length, position, face: null} as Site
        if (sites.some(site => distanceSquared(site, newSite) < Number.EPSILON)) {
            console.log("Site already exists")
            return
        }
        setSites([...sites, newSite])
    }, [sites])

    const algorithm = useMemo(
        () => {
            const a = new FortunesAlgorithm(sites)
            a.beachline.setClippingBounds(0, 800)
            a.run(directrix)
            a.diagram.bind(boundingBox)
            return a
        },
        [directrix, sites]
    )

    const setPlaying = useCallback((playing: boolean) => {
            if (playing) {
                timer.current = window.setInterval(() => {
                    setDirectrix(directrix => directrix + 1)
                }, 50)
            } else {
                if (timer.current) {
                    window.clearInterval(timer.current)
                }
            }
        }, [setDirectrix]
    )

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
            <Display
                diagram={algorithm.diagram}
                beachline={algorithm.beachline}
                directrix={directrix}
                boundingBox={boundingBox}
                onClick={position => addSite(position)}
            />
        </div>
    );
}

export default MainPage
