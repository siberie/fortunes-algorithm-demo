import Face from "./Face";
import Vertex from "./Vertex";
import Site from "./Site";


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