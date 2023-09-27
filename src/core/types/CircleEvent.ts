import Vector2 from "./Vector2";
import Arc from "./Arc";
import RBTreeNode from "../collections/RedBlackTree/RBTreeNode";

type CircleEvent = {
    type: "circle"
    invalidated?: true

    position: Vector2

    center: Vector2

    radius: number

    node: RBTreeNode<Arc>
}

export default CircleEvent