"use client"
import clsx from "clsx";
import {type MouseEvent, useEffect, useRef} from "react";
import type Diagram from "~/core/Diagram";
import type Rectangle from "~/core/types/Rectangle";
import type Beachline from "~/core/Beachline";
import Vector2 from "~/core/types/Vector2";

type DisplayProps = {
    diagram: Diagram
    beachline?: Beachline

    directrix?: number

    boundingBox: Rectangle
    className?: string

    onClick?: (position: Vector2) => void
}

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color = "#ffffff") => {
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
    color = "#ffffff"
) => {
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = color
    ctx.closePath()
    ctx.stroke()
}

const drawBeachLine = (ctx: CanvasRenderingContext2D, beachline: Beachline, width: number, d: number) => {
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

const getCursorPosition = (canvas: HTMLCanvasElement, event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return new Vector2(x, y)
};

const Display = (props: DisplayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {diagram, beachline, directrix} = props
    const {edges, sites} = diagram

    useEffect(() => {
            if (!canvasRef.current)
                return

            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx)
                return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            sites.forEach(site => {
                drawCircle(ctx, site.position.x, site.position.y, 5, site.color ?? "white")
            })

            edges.forEach((edge) => {
                const {start, end} = edge
                drawLine(ctx, start!.position.x, start!.position.y, end!.position.x, end!.position.y, edge.color ?? "white")
            })

            if (beachline && directrix)
                drawBeachLine(ctx, beachline, canvas.width, directrix)

        }, [edges, sites, canvasRef.current, props.diagram, beachline, directrix]
    )

    return <div className={clsx("grow", props.className)}>
        <canvas width={96 * 8} height={96 * 8} ref={canvasRef} className="bg-neutral-800 w-full h-full"
                onClick={event => {
                    const position = getCursorPosition(canvasRef.current!, event)
                    props.onClick?.(position)
                }}
        />
    </div>
}

export default Display