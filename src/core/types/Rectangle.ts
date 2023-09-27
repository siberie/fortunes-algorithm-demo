import Ray from "./Ray";
import Vector2 from "./Vector2";

class Rectangle {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    intersection(ray: Ray) {
        if (!ray.direction.x && !ray.direction.y) return null
        else if (!ray.direction.x) {
            return new Vector2(
                ray.origin.x,
                ray.direction.y > 0 ? this.y + this.height : this.y
            )
        } else if (!ray.direction.y) {
            return new Vector2(
                ray.direction.x > 0 ? this.x + this.width : this.x,
                ray.origin.y
            )
        }

        let x: number = this.x
        if (ray.direction.x > 0)
            x = this.x + this.width
        else if (ray.direction.x < 0)
            x = this.x

        let y = (x - ray.origin.x) * ray.direction.y / ray.direction.x + ray.origin.y

        if (y < this.y || y > this.y + this.height) {
            y = Math.min(this.y + this.height, Math.max(this.y, y))

            x = (y - ray.origin.y) * ray.direction.x / ray.direction.y + ray.origin.x
        }
        return new Vector2(x, y)
    }
}

``

export default Rectangle