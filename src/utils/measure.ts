import type Site from "~/core/types/Site";

export const distanceSquared = (a: Site, b: Site) =>
    (a.position.x - b.position.x) ** 2 + (a.position.y - b.position.y) ** 2
