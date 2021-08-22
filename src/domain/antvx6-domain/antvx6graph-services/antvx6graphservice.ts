import "reflect-metadata";

import { ENodeShape, NodeTypeEnum } from "@/domain/dataflowdesign-domain/dataflowdesign-entitie/dataflowdesign-node-enum"
import { Edge, FunctionExt, Graph, Node, Shape } from "@antv/x6";

import { CheckGraphEdgeConnectedReturnEnum } from "@/shard/graphchart/antv-x6/checkedgeconnectedenum";
import { Dnd } from "@antv/x6/lib/addon";
import GraphFactory from "../../../shard/graphchart/antv-x6/antvx6graph";
import IAntvx6GraphService from "./iantvx6graphservice";
import IGraphConfig from "../../../shard/graphchart/antv-x6/antvx6graphconfig";
import { INodeDataEntity } from "@/domain/dataflowdesign-domain/dataflowdesign-entitie/dataflowdesign-node-entity";
import { INodeTool } from "../antvx6graph-entities/inodetool";
import { injectable } from "inversify";

@injectable()
export class Aantvx6GraphService implements IAntvx6GraphService {
    graph!: Graph;
    addonDnd!: Dnd;
    /**
     * 创建画布
     * @param _graph 
     */
    CreateGraphCanvas(_graph: IGraphConfig): Graph {
        this.graph = GraphFactory.createGraph(_graph);
        /**
         * 单击节点事件
         */
        this.graph.on("node:click", ({ node }) => {
            // console.log("节点被单击了！！！！！！！asd a ！", nodecurren);
            this.reset();
            node.attr("body", {
                stroke: "#41d0ce",
                strokeWidth: 2,
                fill: "#89e8de",
            });
        });
        /**
         * 单击线事件
         */
        this.graph.on("edge:click", ({ edge }) => {
            console.log("单击了线！！！！！！！！");
            this.reset();
            // edge.zIndex = 1000;
            edge.attr("line/stroke", "#41d0ce");
        });
        this.graph!.on("blank:click", () => {
            this.reset();
        });
        /*
         * 鼠标移动到节点显示连接桩
         */
        this.graph.on(
            "node:mouseenter",
            FunctionExt.debounce(() => {
                const ports = document.querySelectorAll(".x6-port-body") as NodeListOf<
                    SVGAElement
                >;
                this.showPorts(ports, true);
            }),
            500
        );
        /**
         * 鼠标移动出节点隐藏连接桩
         */
        this.graph.on(
            "node:mouseleave",
            FunctionExt.debounce(() => {
                const ports = document.querySelectorAll(".x6-port-body") as NodeListOf<
                    SVGAElement
                >;
                this.showPorts(ports, false);
            }),
            500
        );
        return this.graph;
    }
    checkEdgeConnected(edge: Edge): CheckGraphEdgeConnectedReturnEnum {
        if (edge.hasLoop()) {
            this.graph.removeEdge(edge.id);
            return CheckGraphEdgeConnectedReturnEnum.normalNoOneself;
        }
        /**
         * 没有连接到连接桩上
         */
        if (
            edge.getTargetCell() === null ||
            typeof edge.getTargetPortId() === "undefined" ||
            edge.getTargetPortId() === null
        ) {
            this.graph.removeEdge(edge.id);
            return CheckGraphEdgeConnectedReturnEnum.linkToPoint;
        }

        const sourceNode = edge.getSourceNode();
        const targetNode = edge.getTargetNode();
        const allEdgesArr = this.graph.getEdges();
        if (targetNode && sourceNode) {
            /**
             * 判断是否是开始节点
             */
            if (targetNode && targetNode.data.nodeType === NodeTypeEnum.startNode) {
                this.graph.removeEdge(edge.id);
                return CheckGraphEdgeConnectedReturnEnum.nodeStart;
            }
            /**
             * 判断结束节点
             */
            if (sourceNode && sourceNode.data.nodeType === NodeTypeEnum.endNode) {
                this.graph.removeEdge(edge.id);
                return CheckGraphEdgeConnectedReturnEnum.nodeSourceEnd;
            }
            const isexitsarr = allEdgesArr.filter(
                (_edge: any) =>
                    typeof sourceNode.id !== "undefined" &&
                    _edge.source.cell === sourceNode.id &&
                    typeof targetNode.id !== "undefined" &&
                    _edge.target.cell === targetNode.id &&
                    _edge.id !== edge.id
            );
            if (isexitsarr.length > 0) {
                this.graph.removeEdge(edge.id);
                return CheckGraphEdgeConnectedReturnEnum.cannotLinktheSameNode;
            }
            // 避免连线节点形成闭环
            // 避免两个节点之间连接同样的线
            const filter = this.graph.getEdges().filter((_edge: Edge) => {
                const target = _edge.getTargetNode();
                const source = _edge.getSourceNode();
                return (
                    _edge.id !== edge.id &&
                    ((sourceNode.id === target?.id && targetNode.id === source?.id) ||
                        (sourceNode.id === source?.id && targetNode.id === target?.id))
                );
            });
            if (filter.length > 0) {
                this.graph.removeEdge(edge.id);
                return CheckGraphEdgeConnectedReturnEnum.loopNotAllowed;
            }
            // edge.data = new LineData()
        }
        return CheckGraphEdgeConnectedReturnEnum.None;
    }
    CreateAddon(_graph: Graph): void {

    }
    addNode(_node: INodeTool): Node<Node.Properties> | undefined {
        let node: Node | undefined;
        const nodedata: INodeDataEntity ={
            nodeType: _node.type,
            basicConfiguration:[],
            approvalStrategy:[],
          };
        const nodeImage = require("@/assets/icons/" +
            NodeTypeEnum[_node.type] +
            ".png");
        const baseData = {
            attrs: {
                label: {
                    text: _node.label ? _node.label : _node.shape,
                },
                image: {
                    "xlink:Href": nodeImage,
                },
            },
            data: nodedata,
        };
        switch (_node.shape) {
            case ENodeShape[ENodeShape.rect]:
                node = new Shape.Rect(baseData);
                break;
            case ENodeShape[ENodeShape.circle]:
                node = new Shape.Circle(baseData);
                break;
        }
        return node;
    }
    /**
    * 重置节点或者线的Style样式
    */
    private reset() {
        const nodes = this.graph.getNodes();
        const edges = this.graph.getEdges();
        nodes.forEach((node: any) => {
            /***
             * 判断节点类型
             */
            switch (node.shape) {
                case "rect":
                    node.attr("body", {
                        fill: "rgba(95,149,255,0.05)",
                        stroke: "#5f95ff",
                        strokeWidth: 1,
                    });
                    break;
                case "circle":
                    node.attr("body", {
                        stroke: "#fb982c",
                        strokeWidth: 1,
                        fill: "rgba(251,152,44,0.05)",
                    });
                    break;
            }
        });
        edges.forEach((edge: any) => {
            edge.zIndex = 1;
            edge.attr("line/stroke", "#5f95ff");
            edge.prop("labels/0", {
                attrs: {
                    body: {
                        stroke: "#5f95ff",
                    },
                },
            });
        });
    }
    /**
    * 重写拖拽生成节点验证
    * @param node
    */
    validateNode(node: Node): boolean {
        /**
         * 判断开始/结束节点是否存在
         */
        if (
            node.data.nodeType === NodeTypeEnum.endNode ||
            node.data.nodeType === NodeTypeEnum.startNode
        ) {
            const isexitsIndex = this.graph
                .getNodes()
                .filter(
                    (_node: any) =>
                        typeof _node.data.nodeType !== "undefined" &&
                        _node.data.nodeType === node.data.nodeType
                );
            if (isexitsIndex.length > 0) {
                this.graph.removeNode(node.id);
                return false;
            }
        }
        return true;
    }
    /**
     * 显示或者隐藏链接桩
     * @param ports 
     * @param show 
     */
    private showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
            ports[i].style.visibility = show ? "visible" : "hidden";
        }
    }
}