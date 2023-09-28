import type Vector2 from "./Vector2";
import type Site from "./Site";

type SiteEvent = {
    type: "site"
    position: Vector2
    site: Site
}

export default SiteEvent