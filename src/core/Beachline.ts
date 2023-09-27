import RBTree from "./collections/RedBlackTree/RBTree";
import Arc from "./types/Arc";
import Site from "./types/Site";
import RBTreeNode from "./collections/RedBlackTree/RBTreeNode";
import RBTreeVisitor from "./collections/RedBlackTree/RBTreeVisitor";

class Beachline {
    private tree: RBTree<Arc>

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

        if (site.position.x > node.value.site.position.x) {
            if (lowerDelta > Number.EPSILON && upperDelta > Number.EPSILON) {
                if (newArc.intersection(node.value, site.position.y))
                    this.tree.insertAfter(node, node.value.copy())
                return this.tree.insertAfter(node, newArc)
            } else if (lowerDelta < Number.EPSILON) {
                return this.tree.insertBefore(node, newArc)
            } else {
                return this.tree.insertAfter(node, newArc)
            }
        } else {
            if (lowerDelta > Number.EPSILON && upperDelta > Number.EPSILON) {
                if (node.value.intersection(newArc, site.position.y))
                    this.tree.insertBefore(node, node.value.copy())
                return this.tree.insertBefore(node, newArc)
            } else if (lowerDelta < Number.EPSILON) {
                return this.tree.insertAfter(node, newArc)
            } else {
                return this.tree.insertBefore(node, newArc)
            }
        }
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

    get length(): number {
        return this.tree.length
    }

    print() {
        let nodes: number[] = []
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