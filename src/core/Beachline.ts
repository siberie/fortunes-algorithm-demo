import RBTree from "./collections/RedBlackTree/RBTree";
import Arc from "./types/Arc";
import Site from "./types/Site";
import RBTreeNode from "./collections/RedBlackTree/RBTreeNode";
import RBTreeVisitor from "./collections/RedBlackTree/RBTreeVisitor";

class Beachline {
    private tree: RBTree<Arc>
    private clippingBounds: [number, number] = [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]

    constructor() {
        this.tree = new RBTree<Arc>()
    }

    addSite(site: Site): RBTreeNode<Arc> {
        const newArc = new Arc(site)
        const searchResult = this.findArc(site)

        if (searchResult === null) {
            this.tree.setRoot(new RBTreeNode<Arc>(newArc))
            return this.tree.getRoot()!
        }

        const [node, lowerBound, upperBound] = searchResult
        const lowerDelta = Math.abs(lowerBound - site.position.x)
        const upperDelta = Math.abs(upperBound - site.position.x)

        let newNode: RBTreeNode<Arc>

        if (site.position.x > node.value.site.position.x) {
            if (lowerDelta > Number.EPSILON && upperDelta > Number.EPSILON) {
                if (newArc.intersection(node.value, site.position.y))
                    this.tree.insertAfter(node, node.value.copy())
                newNode = this.tree.insertAfter(node, newArc)
            } else if (lowerDelta < Number.EPSILON) {
                newNode = this.tree.insertBefore(node, newArc)
            } else {
                newNode = this.tree.insertAfter(node, newArc)
            }
        } else {
            if (lowerDelta > Number.EPSILON && upperDelta > Number.EPSILON) {
                if (node.value.intersection(newArc, site.position.y))
                    this.tree.insertBefore(node, node.value.copy())
                newNode = this.tree.insertBefore(node, newArc)
            } else if (lowerDelta < Number.EPSILON) {
                newNode = this.tree.insertAfter(node, newArc)
            } else {
                newNode = this.tree.insertBefore(node, newArc)
            }
        }

        const head = this.tree.nodeQueue.front()
        const tail = this.tree.nodeQueue.back()

        if (tail && tail.prev) {
            const tailArc = tail.value.value
            const prevArc = tail.prev.value.value
            const intersection = prevArc.intersection(tailArc, site.position.y)
            if (intersection && intersection > this.clippingBounds[1]) {
                if (tailArc.site.position.y < prevArc.site.position.y) {
                    console.log("clipping tail")
                    this.tree.remove(tail.value)
                }
            }
        }

        if (head && head.next) {
            const headArc = head.value.value
            const nextArc = head.next.value.value
            const intersection = headArc.intersection(nextArc, site.position.y)
            if (intersection && intersection < this.clippingBounds[0]) {
                if (headArc.site.position.y < nextArc.site.position.y) {
                    console.log("clipping head")
                    this.tree.remove(head.value)
                }
            }
        }

        console.log("beachline length", this.tree.length)

        return newNode
    }

    accept(visitor: RBTreeVisitor<Arc>) {
        this.tree.acceptListVisitor(visitor)
    }

    remove(node: RBTreeNode<Arc>) {
        this.tree.remove(node)
    }

    findArc(site: Site): [RBTreeNode<Arc>, number, number] | null {
        let lowerBound = Number.NEGATIVE_INFINITY
        let upperBound = Number.POSITIVE_INFINITY

        let node = this.tree.getRoot()

        while (node) {
            if (node.queueNode.next) {
                upperBound = this.rightBreakPoint(node, site.position.y)
                if (site.position.x > upperBound) {
                    node = node.right
                    continue
                }
            }
            if (node.queueNode.prev) {
                lowerBound = this.leftBreakPoint(node, site.position.y)
                if (site.position.x < lowerBound) {
                    node = node.left
                    continue
                }

            }

            return [node, lowerBound, upperBound]
        }

        return null
    }

    setClippingBounds(left: number, right: number) {
        this.clippingBounds = [left, right]
    }

    get length(): number {
        return this.tree.length
    }

    print() {
        const nodes: number[] = []
        this.tree.acceptListVisitor({
            visit(node: RBTreeNode<Arc>) {
                nodes.push(node.value.site.index)
            }
        })

        console.log(nodes.join(", "))
    }

    leftBreakPoint(node: RBTreeNode<Arc>, y: number): number {
        const prevNode = node.queueNode.prev?.value ?? null
        if (!prevNode) return Number.NEGATIVE_INFINITY

        return prevNode.value.intersection(node.value, y) ?? Number.NEGATIVE_INFINITY
    }

    rightBreakPoint(node: RBTreeNode<Arc>, y: number): number {
        const nextNode = node.queueNode.next?.value ?? null
        if (!nextNode) return Number.POSITIVE_INFINITY

        return node.value.intersection(nextNode.value, y) ?? Number.POSITIVE_INFINITY
    }
}


export default Beachline