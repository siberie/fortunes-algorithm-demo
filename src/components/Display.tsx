"use client"
import clsx from "clsx";
import {useEffect, useRef} from "react";
import Diagram from "~/core/Diagram";
import Rectangle from "~/core/types/Rectangle";
import Beachline from "~/core/Beachline";

type DisplayProps = {
    diagram: Diagram
    beachline?: Beachline

    directrix?: number

    boundingBox: Rectangle
    className?: string
}

const colors = [
    "#ff39bb",
    "#ffbb39",
    "#39ffbb",
    "#39bbff",
    "#bb39ff",
    "#bbff39",
    "#ffffff",
]

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string = "#ffffff") => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.closePath()
    ctx.fill()
}

const drawLine = (
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: string = "#ffffff"
) => {
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = color
    ctx.closePath()
    ctx.stroke()
}

const drawBeachLine = (ctx: CanvasRenderingContext2D, beachline: Beachline, width: number, d: number) => {
    console.log("drawing beachline")
    ctx.beginPath()
    ctx.moveTo(0, d)
    ctx.lineTo(width, d)
    ctx.strokeStyle = "white"
    ctx.closePath()
    ctx.stroke()

    beachline.accept({
        visit: (node) => {
            if (node.value.site.position.y > d)
                return

            const arc = node.value
            const f = arc.y(d)
            ctx.beginPath()
            const points = [...new Array(width).keys()].map(f)
            ctx.moveTo(0, points[0]!)
            points.forEach((y, x) => {
                ctx.lineTo(x, y)
            })
            ctx.strokeStyle = "#81745d"
            ctx.stroke()
        }
    })
}

const Display = (props: DisplayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {diagram, beachline, directrix} = props

    useEffect(() => {
            if (!canvasRef.current)
                return

            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx)
                return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            diagram.sites.forEach(site => {
                drawCircle(ctx, site.position.x, site.position.y, 5, site.color ?? "white")
            })

            diagram.edges.forEach((edge, index) => {
                const {start, end} = edge
                drawLine(ctx, start!.position.x, start!.position.y, end!.position.x, end!.position.y, edge.color ?? "white")
            })

            if (beachline && directrix)
                drawBeachLine(ctx, beachline, canvas.width, directrix)

            const x0 = 260
            const y0 = 150
            const x1 = x0 + 78
            const y1 = y0 + 62

            // drawCircle(ctx, x0, y0, 5)
            // drawLine(ctx, x0, y0, x1, y1)
        }, [canvasRef.current, props.diagram, beachline, directrix]
    )

    return <div className={clsx("grow", props.className)}>
        <canvas width={96 * 8} height={96 * 8} ref={canvasRef} className="bg-neutral-800 w-full h-full"/>
    </div>
}

export default Display