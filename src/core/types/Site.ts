import type Vector2 from "./Vector2";
import type Face from "./Face";

type Site = {
    index: number
    position: Vector2
    face: Face | null

    color?: string
}

export default Site