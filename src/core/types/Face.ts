import Site from "./Site";
import Edge from "./Edge";

type Face = {
    site: Site
    edge: Edge | null
}

export default Face