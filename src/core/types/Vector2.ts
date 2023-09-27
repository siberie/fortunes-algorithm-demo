class Vector2 {
    x: number
    y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    orthogonal = (): Vector2 => new Vector2(this.y, -this.x)

    normalised = (): Vector2 => {
        const length = this.norm()
        return new Vector2(this.x / length, this.y / length)
    }

    reversed() {
        return this.mul(-1)
    }

    add = (v: Vector2): Vector2 => new Vector2(this.x + v.x, this.y + v.y)
    sub = (v: Vector2): Vector2 => new Vector2(this.x - v.x, this.y - v.y)
    mul = (x: number): Vector2 => new Vector2(this.x * x, this.y * x)
    div = (x: number): Vector2 => new Vector2(this.x / x, this.y / x)

    cross = (v: Vector2): number => this.x * v.y - this.y * v.x

    norm = (): number => Math.sqrt(this.x ** 2 + this.y ** 2)

    normSquared = () => this.x ** 2 + this.y ** 2
}

export default Vector2