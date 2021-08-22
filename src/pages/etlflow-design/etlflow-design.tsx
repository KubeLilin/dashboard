import "./etlflow-design.less"

import * as NodeTool from "@/shard/graphchart/antv-x6/node-button-config"

import { Addon, Graph, Node } from "@antv/x6";
import { Button, Row, message } from "antd";

import { CheckGraphEdgeConnectedReturnEnum } from "@/shard/graphchart/antv-x6/checkedgeconnectedenum"
import IAantvx6GraphService from "@/domain/antvx6-domain/antvx6graph-services/iantvx6graphservice";
import IGraphConfig from "@/shard/graphchart/antv-x6/antvx6graphconfig";
import { INodeTool } from "@/domain/antvx6-domain/antvx6graph-entities/inodetool";
import { IocTypes } from "@/shard/inversionofcontrol/ioc-config-types";
import { NodeDataEntity } from "@/domain/dataflowdesign-domain/dataflowdesign-entitie/dataflowdesign-node-entity";
import { NodeTypeEnum } from "@/domain/dataflowdesign-domain/dataflowdesign-entitie/dataflowdesign-node-enum";
import Provider from "@/shard/dependencyInjection/ioc-provicer";
import React from 'react';
import { validateEdgeMessage } from "@/shard/graphchart/antv-x6/validateedgemessage"

class GraphPage extends React.Component {
  /**
   * 画布操作业务层
   */
  @Provider(IocTypes.Aantvx6GraphService)
  private iantvx6graphService!: IAantvx6GraphService
  private canRedo: boolean = false;
  private canUndo: boolean = false;
  private graph!: Graph;
  private buttonNodeToolArr = NodeTool.buttonNodeToolList;
  private addonDnd: any;
  /**
   * 如果需要Dom初始化的应放在此方法内
   */
  componentDidMount() {
    const config: IGraphConfig = {
      container: "container",
      miniMapContainer: "destiny-minimap",
    };
    this.graph = this.iantvx6graphService.CreateGraphCanvas(config);
    this.graph.history.on("change", () => {
      this.canRedo = this.graph.history.canRedo();
      this.canUndo = this.graph.history.canUndo();
    });
    /**
     * 线连接到锚点事件
     */
    this.graph.on("edge:connected", ({ edge }) => {
      const validate: CheckGraphEdgeConnectedReturnEnum = this.iantvx6graphService.checkEdgeConnected(
        edge
      );
      const actions = validateEdgeMessage.get(validate);
      if (typeof actions !== "undefined") {
        message.warning(actions);
      }
    });
    /**
     * 双击节点事件
     */
    this.graph.on("node:dblclick", ({ node }) => {
      console.log(node)
      if ((node.data as NodeDataEntity).nodeType !== NodeTypeEnum.workNode) {
        message.warning(
          typeof node.data.nodeType !== "undefined" &&
            node.data.nodeType === NodeTypeEnum.startNode
            ? "开始节点不允许配置属性!" : "结束节点不允许配置属性!",
          3
        );
        return;
      }
      // this.nodeOperateInfo.Show(this.getNodeEntity(node));
    });
    /**
     * 重写检查方法
     * @param node 
     */
    const validateNode = (node: Node) => {
      const result = this.iantvx6graphService.validateNode(node);
      if (!result && node.data.nodeType !== NodeTypeEnum.workNode) {
        message.warning(
          typeof node.data.nodeType !== "undefined" &&
            node.data.nodeType === NodeTypeEnum.startNode
            ? "流程只允许有一个开始节点!"
            : "流程只允许有一个结束节点!",
          3
        );
        return false;
      }
      return true;
    };
    /**
     * 重写检查方法
     * @param this
     * @param node
     */
    this.addonDnd = new Addon.Dnd({
      target: this.graph,
      animation: true,
      validateNode,
    });
  }
  /**
   * 开始拖拽
   * @param e
   */
  startDrag(e: any, item: INodeTool) {
    // debugger
    const node = this.iantvx6graphService.addNode(item);
    this.addonDnd.start(node, e as any);
  }
  /***
   *
   */
  onRedo() {
    this.graph.history.redo();
    console.log(1)
  }
  onUndo() {
    this.graph.history.undo();
    console.log(2)
  }
  render() {
    return (
      <div id="flow-design-panel">
        <nav className="flow-design-panel-left">
          {
            this.buttonNodeToolArr.map(_item => {
              return <Button key={_item.type} draggable="true" type="primary" onMouseDown={($event) => this.startDrag($event, _item)} >{_item.label}</Button>
            })
          }
        </nav>
        <div className="flow-design-panel-graph">
          <Row className="flow-design-panel-toolbar">
            <Button type="primary" onClick={() => this.onUndo()} >导入任务</Button>
            <Button type="primary" onClick={() => this.onRedo()}>重做</Button>
            <Button type="primary" onClick={() => this.onUndo()} >撤消</Button>
          </Row>
          <div id="graph">
            <div id="destiny-minimap" className="minimapContainer"></div>
            <div id="container">
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default GraphPage;