import { ENodeShape, NodeTypeEnum } from "../../../domain/dataflowdesign-domain/dataflowdesign-entitie/dataflowdesign-node-enum";

import {INodeTool} from "../../../domain/antvx6-domain/antvx6graph-entities/inodetool"

export const buttonNodeToolList: Array<INodeTool> = [
    {
        type: NodeTypeEnum.startNode,
        shape: ENodeShape[ENodeShape.circle],
        label: "开始节点",
        icon: require("@/assets/icons/startNode.png")
    },
    {
        type: NodeTypeEnum.workNode,
        shape: ENodeShape[ENodeShape.rect],
        label: "任务节点",
        icon: require("@/assets/icons/workNode.png")
    },
    {
        type: NodeTypeEnum.endNode,
        shape: ENodeShape[ENodeShape.circle],
        label: "结束节点",
        icon: require("@/assets/icons/endNode.png")
    },
]