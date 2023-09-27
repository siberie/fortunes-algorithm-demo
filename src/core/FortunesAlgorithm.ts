import Beachline from "./Beachline";
import Site from "./types/Site";
import EventQueue from "./EventQueue";
import CircleEvent from "./types/CircleEvent";
import SiteEvent from "./types/SiteEvent";
import Arc from "./types/Arc";
import Vector2 from "./types/Vector2";
import RBTreeNode from "./collections/RedBlackTree/RBTreeNode";
import Diagram from "./Diagram";
import Vertex from "./types/Vertex";
import Edge from "./types/Edge";

class FortunesAlgorithm {
    beachline: Beachline
    eventQueue: EventQueue
    diagram: Diagram

    constructor(sites: Site[]) {
        this.beachline = new Beachline()
        this.eventQueue = new EventQueue()
        this.diagram = new Diagram(sites.map(site => ({...site, face: {site, edge: null}})))

        this.diagram.sites.forEach(site => this.eventQueue.enqueue({type: "site", position: site.position, site}))
    }

    run(until: number | null = null) {
        while (!this.eventQueue.isEmpty()) {
            const event = this.eventQueue.dequeue()

            if (event === null) {
                throw new Error("Event queue is empty")
            }

            if (until && event.position.y > until) break

            if (event.type === "site") {
                this.handleSiteEvent(event)
            } else if (!event.invalidated) {
                this.handleCircleEvent(event)
            }
        }
    }

    private handleSiteEvent(event: SiteEvent) {
        console.log("site event", event.site.index, event.position.x, event.position.y)
        if (this.beachline.length === 0) {
            this.beachline.addSite(event.site)
            return
        }

        const node = this.beachline.addSite(event.site)

        const prevNode = node.queueNode.prev?.value ?? null
        const nextNode = node.queueNode.next?.value ?? null

        const site = event.site
        const previousSite = (prevNode?.value.site ?? nextNode?.value.site) ?? null

        if (previousSite === null) return

        const [edge, twin] = this.createEdge(site, previousSite)

        node.value.rightEdge = edge
        node.value.leftEdge = twin

        if (nextNode) {
            nextNode.value.leftEdge = edge
        }

        if (prevNode) {
            prevNode.value.rightEdge = twin
        }

        this.beachline.print()

        if (prevNode)
            this.checkCircleEvent(prevNode, site.position.y)

        this.checkCircleEvent(node, site.position.y)

        if (nextNode)
            this.checkCircleEvent(nextNode, site.position.y)
    }

    private handleCircleEvent(event: CircleEvent) {
        const node = event.node
        const prevNode = node.queueNode.prev!.value
        const nextNode = node.queueNode.next!.value
        console.log(
            "circle event",
            prevNode.value.site.index,
            node.value.site.index,
            nextNode.value.site.index,
            event.position.x,
            event.center.y,
            event.radius,
            event.position.y,
        )
        this.beachline.remove(event.node)

        this.beachline.print()

        const [edge, twin] = this.createEdge(prevNode.value.site, nextNode.value.site)
        const vertex: Vertex = this.diagram.createVertex(event.center)

        edge.color = "red"
        twin.color = "red"

        if (node.value.leftEdge) {
            node.value.leftEdge.start = vertex
            node.value.leftEdge.twin.end = vertex
        }

        if (node.value.rightEdge) {
            node.value.rightEdge.start = vertex
            node.value.rightEdge.twin.end = vertex
        }

        edge.end = vertex
        twin.start = vertex

        prevNode.value.rightEdge = edge
        nextNode.value.leftEdge = edge

        this.checkCircleEvent(prevNode, event.position.y)
        this.checkCircleEvent(nextNode, event.position.y)
    }

    private checkCircleEvent(node: RBTreeNode<Arc>, y: number) {
        const prevNode = node.queueNode.prev?.value ?? null
        const nextNode = node.queueNode.next?.value ?? null

        if (node.value.event) {
            node.value.event.invalidated = true
            node.value.event = null
        }

        if (!prevNode || !nextNode) return null

        const circle = this.calculateCircle(
            prevNode.value,
            node.value,
            nextNode.value
        )

        if (!circle) return

        const {center, radius} = circle

        const event: CircleEvent = {
            type: "circle",
            position: new Vector2(center.x, center.y + radius),
            center,
            radius,
            node
        }
        console.log(
            "--> adding circle event",
            prevNode.value.site.index,
            node.value.site.index,
            nextNode.value.site.index,
            event.position.x,
            event.center.y,
            event.radius,
            event.position.y,
        )

        node.value.event = event
        this.eventQueue.enqueue(event)
    }

    private calculateCircle(arc1: Arc, arc2: Arc, arc3: Arc) {
        // Algorithm from O'Rourke 2ed
        const a = arc1.site.position
        const b = arc2.site.position
        const c = arc3.site.position

        const A = b.x - a.x
        const B = b.y - a.y
        const C = c.x - a.x
        const D = c.y - a.y
        const E = A * (a.x + b.x) + B * (a.y + b.y)
        const F = C * (a.x + c.x) + D * (a.y + c.y)
        const G = 2 * (A * (c.y - b.y) - B * (c.x - b.x))

        if (G <= Number.EPSILON) return null // Points are co-linear

        const uX = (D * E - B * F) / G
        const uY = (A * F - C * E) / G

        const center = new Vector2(uX, uY)
        const radius = Math.sqrt(Math.pow(a.x - uX, 2) + Math.pow(a.y - uY, 2))

        return {center, radius}
    }

    createEdge = (siteA: Site, siteB: Site): [Edge, Edge] => {
        const edge: Edge = {
            face: siteA.face!,
            start: null,
            end: null,
            next: null,
            prev: null,
            twin: null!,
            color: siteA.color
        };

        const twin: Edge = {
            face: siteB.face!,
            start: null,
            end: null,
            next: null,
            prev: null,
            twin: edge,
            color: siteA.color
        }

        edge.twin = twin

        if (!siteA.face!.edge)
            siteA.face!.edge = edge

        if (!siteB.face!.edge)
            siteB.face!.edge = twin

        this.diagram.edges.push(edge)
        this.diagram.edges.push(twin)

        return [edge, twin]
    }
}

export default FortunesAlgorithm