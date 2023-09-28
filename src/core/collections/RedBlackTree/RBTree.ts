import Deque from "../deque";
import RBTreeNode from "./RBTreeNode";
import RBTreeVisitor from "./RBTreeVisitor";

class RBTree<ValueType> {
    private root: RBTreeNode<ValueType> | null
    nodeQueue: Deque<RBTreeNode<ValueType>>

    constructor() {
        this.root = null
        this.nodeQueue = new Deque<RBTreeNode<ValueType>>()
    }

    setRoot(node: RBTreeNode<ValueType>): void {
        this.root = node
        this.nodeQueue = new Deque<RBTreeNode<ValueType>>()
        this.root.queueNode = this.nodeQueue.insertBefore(null, node.queueNode)
        this.root.color = "black"
    }

    getRoot() {
        return this.root
    }

    insertBefore(node: RBTreeNode<ValueType>, value: ValueType): RBTreeNode<ValueType> {
        const prev = node.queueNode.prev?.value ?? null
        const newNode = new RBTreeNode(value)
        newNode.queueNode = this.nodeQueue.insertBefore(node.queueNode, newNode.queueNode)

        if (node.left) {
            prev!.right = newNode
            newNode.parent = prev!
        } else {
            node.left = newNode
            newNode.parent = node
        }

        this.balanceTreeAfterInsert(newNode)

        return newNode
    }

    insertAfter(node: RBTreeNode<ValueType>, value: ValueType): RBTreeNode<ValueType> {
        const next = node.queueNode.next?.value ?? null
        const newNode = new RBTreeNode(value)

        newNode.queueNode = this.nodeQueue.insertAfter(node.queueNode, newNode.queueNode)

        if (node.right) {
            next!.left = newNode
            newNode.parent = next!
        } else {
            node.right = newNode
            newNode.parent = node
        }

        this.balanceTreeAfterInsert(newNode)

        return newNode
    }

    remove(z: RBTreeNode<ValueType>): void {
        let y = z
        let color = y.color
        let x: RBTreeNode<ValueType> | null

        if (!z.left) {
            x = z.right
            this.transplant(z, z.right)
        } else if (!z.right) {
            x = z.left
            this.transplant(z, z.left)
        } else {
            y = this.minimum(z.right)
            color = y.color
            x = y.right

            if (y.parent !== z) {
                this.transplant(y, y.right)
                y.right = z.right
                y.right.parent = y
            }

            this.transplant(z, y)
            y.left = z.left
            y.left.parent = y
            y.color = z.color
        }

        this.nodeQueue.remove(z.queueNode)

        if (color === "black") {
            this.balanceTreeAfterRemove(x ?? this.root!)
        }
    }

    replace(oldNode: RBTreeNode<ValueType>, newNode: RBTreeNode<ValueType>): void {
        this.transplant(oldNode, newNode)
        newNode.left = oldNode.left
        newNode.right = oldNode.right
        newNode.color = oldNode.color

        if (this.root === oldNode)
            this.root = newNode

        if (newNode.left)
            newNode.left.parent = newNode

        if (newNode.right)
            newNode.right.parent = newNode

        this.nodeQueue.replace(oldNode.queueNode, newNode.queueNode)
    }

    get length() {
        return this.nodeQueue.length
    }

    acceptListVisitor(visitor: RBTreeVisitor<ValueType>): void {
        let node = this.nodeQueue.front()

        while (node) {
            visitor.visit(node.value)
            node = node.next
        }
    }

    acceptTreeVisitor(visitor: RBTreeVisitor<ValueType>): void {
        const queue = new Deque<RBTreeNode<ValueType>>()
        queue.enqueue(this.root!)

        while (queue.length > 0) {
            const node = queue.dequeue()!

            if (node.value.left)
                queue.enqueue(node.value.left)

            if (node.value.right)
                queue.enqueue(node.value.right)

            visitor.visit(node.value)
        }
    }

    private minimum(node: RBTreeNode<ValueType>): RBTreeNode<ValueType> {
        while (node.left)
            node = node.left

        return node
    }

    private transplant(node: RBTreeNode<ValueType>, newNode: RBTreeNode<ValueType> | null): void {
        if (node.parent) {
            if (node.parent.left === node) {
                node.parent.left = newNode
            } else {
                node.parent.right = newNode
            }
        } else {
            this.root = newNode
        }

        if (newNode)
            newNode.parent = node.parent
    }

    private balanceTreeAfterInsert(node: RBTreeNode<ValueType>) {
        let grandpa, uncle: RBTreeNode<ValueType>;
        let parent = node.parent!

        while (parent && parent.color === "red") {
            grandpa = parent.parent!;
            if (parent === grandpa.left) {
                uncle = grandpa.right!;
                if (uncle?.color) {
                    parent.color = uncle.color = "black";
                    grandpa.color = "red";
                    node = grandpa;
                } else {
                    if (node === parent.right) {
                        this.rotateLeft(parent);
                        node = parent;
                        parent = node.parent!;
                    }
                    parent.color = "black";
                    grandpa.color = "red";
                    this.rotateRight(grandpa);
                }
            } else {
                uncle = grandpa.left!;
                if (uncle?.color) {
                    parent.color = uncle.color = "black";
                    grandpa.color = "red";
                    node = grandpa;
                } else {
                    if (node === parent.left) {
                        this.rotateRight(parent);
                        node = parent;
                        parent = node.parent!;
                    }
                    parent.color = "black";
                    grandpa.color = "red";
                    this.rotateLeft(grandpa);
                }
            }
            parent = node.parent!;
        }

        this.root!.color = "black";
    }

    private balanceTreeAfterRemove(node: RBTreeNode<ValueType>): void {
        while (node !== this.root && node.color === "black") {
            const parent = node.parent!
            let sibling: RBTreeNode<ValueType> | null

            if (node === parent.left) {
                sibling = parent.right!

                if (sibling?.color === "red") {
                    sibling.color = "black"
                    parent.color = "red"
                    this.rotateLeft(parent)
                    sibling = parent.right!
                }

                if (sibling?.left?.color === "black" && sibling.right?.color === "black") {
                    sibling.color = "red"
                    node = parent
                } else {
                    if (sibling?.right?.color === "black") {
                        if (sibling.left)
                            sibling.left.color = "black"
                        sibling.color = "red"
                        this.rotateRight(sibling)
                        sibling = parent.right
                    }

                    if (sibling)
                        sibling.color = parent.color
                    parent.color = "black"
                    if (sibling?.right)
                        sibling.right.color = "black"
                    this.rotateLeft(parent)
                    node = this.root!
                }
            } else {
                sibling = parent.left

                if (sibling?.color === "red") {
                    sibling.color = "black"
                    parent.color = "red"
                    this.rotateRight(parent)
                    sibling = parent.left
                }

                if (sibling?.right?.color === "black" && sibling.left?.color === "black") {
                    sibling.color = "red"
                    node = parent
                } else {
                    if (sibling?.left?.color === "black") {
                        if (sibling.right)
                            sibling.right.color = "black"
                        sibling.color = "red"
                        this.rotateLeft(sibling)
                        sibling = parent.left
                    }

                    if (sibling)
                        sibling.color = parent.color
                    parent.color = "black"
                    if (sibling?.left)
                        sibling.left.color = "black"
                    this.rotateRight(parent)
                    node = this.root!
                }
            }
        }
        if (node)
            node.color = "black"
    }

    private rotateLeft(node: RBTreeNode<ValueType>): void {
        const right = node.right
        node.right = right?.left ?? null

        if (right?.left) {
            right.left.parent = node
        }

        if (right)
            right.parent = node.parent

        if (!node.parent) {
            this.root = right
        } else if (node === node.parent.left) {
            node.parent.left = right
        } else {
            node.parent.right = right
        }

        if (right)
            right.left = node
        node.parent = right
    }

    private rotateRight(node: RBTreeNode<ValueType>): void {
        const left = node.left
        node.left = left?.right ?? null

        if (left?.right) {
            left.right.parent = node
        }

        if (left)
            left.parent = node.parent

        if (!node.parent) {
            this.root = left
        } else if (node === node.parent.right) {
            node.parent.right = left
        } else {
            node.parent.left = left
        }

        if (left)
            left.right = node

        node.parent = left
    }
}

export default RBTree