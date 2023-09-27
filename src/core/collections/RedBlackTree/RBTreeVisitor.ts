import RBTreeNode from "./RBTreeNode";

interface RBTreeVisitor<ValueType> {
    visit(node: RBTreeNode<ValueType>): void
}

export default RBTreeVisitor