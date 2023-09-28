import type Face from "./Face";
import type Vertex from "./Vertex";


type Edge = {
    face: Face

    start: Vertex | null
    end: Vertex | null

    next: Edge | null
    prev: Edge | null
    twin: Edge

    color?: string
}

export default Edge