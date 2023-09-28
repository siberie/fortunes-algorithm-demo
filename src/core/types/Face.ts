import type Site from "./Site";
import type Edge from "./Edge";

type Face = {
    site: Site
    edge: Edge | null
}

export default Face