import { Guid } from "guid-typescript";
import { IEntity } from "../../../shard/entity/ibaseentity"
import { NodeTypeEnum } from "./dataflowdesign-node-enum"
import { Ports } from "../../antvx6-domain/antvx6graph-entities/flow-node-port-entity"

export class NodeEntity implements IEntity<string> {
    id: string=Guid.EMPTY.toString();
    /**
   * 子节点/边。
   */
    children: Array<string> = [];
    /**
     * 节点/边关联的业务数据。
     */
    data: INodeDataEntity = new NodeDataEntity();
    /**
     * 名称
     */
    label: string = "";
    /**
     * 父节点。
     */
    parent: string = "";
    /**
     * 渲染节点/边的图形。
     */
    shape: string = "";
    /**
     * 节点/边是否可见。
     */
    visible: boolean = true;
    /**
     * 横向坐标
     */
    x: number = 10;
    /**
     * 纵向坐标
     */
    y: number = 10;
    /**
     * 链接桩数组
     */
    ports: Ports = new Ports();
}
/**
 * 节点内数据
 */
export interface INodeDataEntity {
    /**
     * 节点类型
     */
    nodeType: NodeTypeEnum;
    /**
     * 节点基础配置
     */
    basicConfiguration: Object;
    /**
     * 节点审批策略
     */
    approvalStrategy: Object;
}
export class NodeDataEntity implements INodeDataEntity {
    /**
     * 节点类型
     */
    nodeType: NodeTypeEnum = NodeTypeEnum.workNode;
    /**
     * 节点基础配置
     */
    basicConfiguration: Object = [];
    /**
     * 节点审批策略
     */
    approvalStrategy: Object = [];
}