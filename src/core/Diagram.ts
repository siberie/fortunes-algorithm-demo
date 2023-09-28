import Vertex from "./types/Vertex";
import Site from "./types/Site";
import Edge from "./types/Edge";
import Face from "./types/Face";
import Rectangle from "./types/Rectangle";
import Ray from "./types/Ray";
import Vector2 from "./types/Vector2";

class Diagram {
    vertices: Vertex[]
    sites: Site[]
    edges: Edge[]
    faces: Face[]

    constructor(sites: Site[]) {
        this.vertices = [];
        this.sites = sites;
        this.edges = [];
        this.faces = sites.map(s => s.face!);
    }

    bind(rectangle: Rectangle) {
        const openEdges = this.edges.filter(e => e.start === null || e.end === null)

        for (const edge of openEdges) {
            const ray = this.ray(edge)

            if (edge.start === null && edge.end === null) {
                const intersection1 = rectangle.intersection(ray)
                const intersection2 = rectangle.intersection({...ray, direction: ray.direction.reversed()})

                if (!intersection1 || !intersection2) return
                edge.start = this.createVertex(intersection1)
                edge.end = this.createVertex(intersection2)
            } else if (edge.end === null) {
                const intersection = rectangle.intersection({...ray})
                if (!intersection) return
                edge.end = this.createVertex(intersection)
            } else {
                const intersection = rectangle.intersection({...ray, direction: ray.direction.reversed()})
                if (!intersection) return
                edge.start = this.createVertex(intersection)
            }
        }
    }

    createVertex = (position: Vector2): Vertex => {
        const vertex: Vertex = {
            position
        }

        this.vertices.push(vertex)

        return vertex
    }

    private ray(edge: Edge): Ray {
        const a = edge.face.site.position
        const b = edge.twin.face.site.position

        const delta = b.sub(a)
        const direction = delta.orthogonal().normalised()
        const origin = delta.mul(0.5).add(a)

        return {origin, direction}
    }
}

export default Diagram