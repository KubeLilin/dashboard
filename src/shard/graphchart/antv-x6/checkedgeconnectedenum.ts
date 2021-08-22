/**
 * 连接线返回类型
 */
export enum CheckGraphEdgeConnectedReturnEnum {
    /**
     * 默认什么都不做
     */
    None,
    /**
     * 目标不可为自身
     */
    normalNoOneself,
    /**
     * 链接目标不可为开始节点
     */
    nodeStart,
    /**
     * 源节点不能为结束节点
     */
    nodeSourceEnd,
    /**
     * 两个节点不允许循环连接
     */
    loopNotAllowed,
    /**
     * 请连接到连接点内
     */
    linkToPoint,
    /**
     * 不可链接相同节点
     */
    cannotLinktheSameNode
}