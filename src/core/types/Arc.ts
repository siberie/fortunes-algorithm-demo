import Site from "./Site";
import Edge from "./Edge";
import {QueueEvent} from "../EventQueue";
import CircleEvent from "./CircleEvent";

type Function<Args, Return> = (args: Args) => Return

class Arc {
    site: Site

    leftEdge: Edge | null
    rightEdge: Edge | null

    event: CircleEvent | null

    color: string

    constructor(
        site: Site,
        leftEdge: Edge | null = null,
        rightEdge: Edge | null = null,
        event: CircleEvent | null = null,
        color = "white"
    ) {
        this.site = site
        this.leftEdge = leftEdge
        this.rightEdge = rightEdge
        this.event = event
        this.color = color
    }

    getCoefficientFunctions(): [Function<number, number>, Function<number, number>, Function<number, number>] {
        const a = (y: number) => 1 / (2 * (this.site.position.y - y))
        const b = (y: number) => -2 * this.site.position.x * a(y)
        const c = (y: number) => a(y) * (this.site.position.normSquared() - y ** 2)
        return [a, b, c]
    }

    y(d: number): (x: number) => number {
        const [a, b, c] = this.getCoefficientFunctions()
        return x => a(d) * x ** 2 + b(d) * x + c(d)
    }

    intersection(arc: Arc, y: number): number | null {
        if (arc.site.position.y === y && this.site.position.y === y) {
            if (this.site.position.x < arc.site.position.x)
                return (arc.site.position.x + this.site.position.x) / 2
            else
                return null
        } else if (arc.site.position.y === y) {
            return arc.site.position.x
        } else if (this.site.position.y === y) {
            return this.site.position.x
        }

        const [a1, b1, c1] = this.getCoefficientFunctions()
        const [a2, b2, c2] = arc.getCoefficientFunctions()

        const a = a1(y) - a2(y)
        const b = b1(y) - b2(y)
        const c = c1(y) - c2(y)

        if (a === 0)
            if (this.site.position.x < arc.site.position.x)
                return -c / b
            else
                return null

        const discriminant = b ** 2 - 4 * a * c
        if (discriminant < 0) return null


        return 0 + (-b - Math.sqrt(discriminant)) / (2 * a)
    }

    copy(): Arc {
        return new Arc(this.site, this.leftEdge, this.rightEdge, this.event)
    }
}

export default Arc