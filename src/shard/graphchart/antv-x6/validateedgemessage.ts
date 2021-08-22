import { CheckGraphEdgeConnectedReturnEnum } from "./checkedgeconnectedenum";

export const validateEdgeMessage: Map<CheckGraphEdgeConnectedReturnEnum, string> = new Map([
    [CheckGraphEdgeConnectedReturnEnum.normalNoOneself, "不允许连接自身"],
    [CheckGraphEdgeConnectedReturnEnum.linkToPoint, "未连接到连接桩上"],
    [CheckGraphEdgeConnectedReturnEnum.loopNotAllowed, "不允许两个节点循环连接"],
    [CheckGraphEdgeConnectedReturnEnum.nodeStart, "不允许开始节点作为目标节点"],
    [CheckGraphEdgeConnectedReturnEnum.nodeSourceEnd, "源节点不能为结束节点"],
    [CheckGraphEdgeConnectedReturnEnum.cannotLinktheSameNode, "不允许在相同起始和终止节点之间创建多条边"]
]);