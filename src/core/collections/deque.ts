export type DequeNode<ValueType> = {
    next: DequeNode<ValueType> | null
    prev: DequeNode<ValueType> | null

    value: ValueType
}

export const createDequeNode = <ValueType>(
    value: ValueType,
    next: DequeNode<ValueType> | null = null,
    prev: DequeNode<ValueType> | null = null
): DequeNode<ValueType> => ({
    value,
    next,
    prev
})

class Deque<ValueType> {
    private head: DequeNode<ValueType> | null
    private tail: DequeNode<ValueType> | null
    private count: number

    constructor() {
        this.head = null
        this.tail = null
        this.count = 0
    }

    get length(): number {
        return this.count
    }

    enqueue(value: ValueType): DequeNode<ValueType> {
        let newNode = createDequeNode(value);
        this.insertAfter(null, newNode)
        console.log('enqueue', this.count, newNode)

        return newNode
    }

    dequeue(): DequeNode<ValueType> | null {
        if (!this.head) return null

        const node = this.head
        this.remove(node)
        console.log('dequeue', this.count, node.value)

        return node
    }

    insertBefore(node: DequeNode<ValueType> | null, newNode: DequeNode<ValueType>): DequeNode<ValueType> {
        if (this.head === null) {
            this.head = newNode
            this.tail = newNode
            newNode.next = null
            newNode.prev = null
        } else {
            if (!node)
                node = this.head

            if (node === this.head)
                this.head = newNode

            newNode.next = node
            newNode.prev = node?.prev ?? null

            if (newNode.prev)
                newNode.prev.next = newNode

            if (newNode.next)
                newNode.next.prev = newNode
        }

        this.count++

        return newNode
    }

    insertAfter(node: DequeNode<ValueType> | null, newNode: DequeNode<ValueType>): DequeNode<ValueType> {
        if (this.tail === null) {
            this.head = newNode
            this.tail = newNode
            newNode.next = null
            newNode.prev = null
        } else {
            if (!node)
                node = this.tail

            if (node === this.tail)
                this.tail = newNode

            newNode.next = node?.next ?? null
            newNode.prev = node

            if (newNode.next)
                newNode.next.prev = newNode

            if (newNode.prev)
                newNode.prev.next = newNode
        }

        this.count++

        return newNode
    }

    remove(node: DequeNode<ValueType>): void {
        if (node.prev) node.prev.next = node.next
        if (node.next) node.next.prev = node.prev

        if (node === this.head) this.head = node.next
        if (node === this.tail) this.tail = node.prev

        this.count--
    }

    replace(node: DequeNode<ValueType>, newNode: DequeNode<ValueType>): void {
        newNode.next = node.next
        newNode.prev = node.prev

        if (node === this.head) this.head = newNode
        if (node === this.tail) this.tail = newNode

        if (newNode.prev) newNode.prev.next = newNode
        if (newNode.next) newNode.next.prev = newNode
    }


    front(): DequeNode<ValueType> | null {
        return this.head
    }

    back(): DequeNode<ValueType> | null {
        return this.tail
    }
}

export default Deque