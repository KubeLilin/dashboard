import { Addon, Edge, Graph, Node } from "@antv/x6";

import { CheckGraphEdgeConnectedReturnEnum } from "@/shard/graphchart/antv-x6/checkedgeconnectedenum";
import IGraphConfig from "../../../shard/graphchart/antv-x6/antvx6graphconfig";
import { INodeTool } from "../antvx6graph-entities/inodetool";

export default interface IAntvx6GraphService{
    graph: Graph;
    addonDnd:Addon.Dnd;
    CreateGraphCanvas(_graph: IGraphConfig):Graph;
    checkEdgeConnected( edge: Edge): CheckGraphEdgeConnectedReturnEnum;
    CreateAddon(_graph:Graph):void;
    addNode(_node: INodeTool): Node | undefined;
    validateNode(node: Node):boolean;
}