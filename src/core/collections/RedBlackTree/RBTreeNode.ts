import {createDequeNode, type DequeNode} from "../deque";
import type RBTreeVisitor from "./RBTreeVisitor";

class RBTreeNode<ValueType> {
    left: RBTreeNode<ValueType> | null
    right: RBTreeNode<ValueType> | null
    parent: RBTreeNode<ValueType> | null

    value: ValueType

    color: "red" | "black"

    queueNode: DequeNode<RBTreeNode<ValueType>>

    constructor(value: ValueType) {
        this.value = value
        this.left = null
        this.right = null
        this.parent = null
        this.color = "red"
        this.queueNode = createDequeNode(this)
    }

    accept(visitor: RBTreeVisitor<ValueType>): void {
        visitor.visit(this)
    }
}

export default RBTreeNode