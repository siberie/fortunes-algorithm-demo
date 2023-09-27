import {heapExtract, heapInsert} from "./collections/heap";
import SiteEvent from "./types/SiteEvent";
import CircleEvent from "./types/CircleEvent";

export type QueueEvent = SiteEvent | CircleEvent;

const keyFunc = (a: QueueEvent, b: QueueEvent) => {
    if (Math.abs(a.position.y - b.position.y) > Number.EPSILON)
        return b.position.y - a.position.y
    else
        return b.position.x - a.position.x;
}

class EventQueue {
    private readonly queue: Array<QueueEvent>;

    constructor() {
        this.queue = [];
    }

    enqueue(event: QueueEvent): void {
        heapInsert(this.queue, event, keyFunc)
    }

    dequeue(): QueueEvent | null {
        return heapExtract(this.queue, keyFunc) ?? null;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    size(): number {
        return this.queue.length;
    }

}

export default EventQueue