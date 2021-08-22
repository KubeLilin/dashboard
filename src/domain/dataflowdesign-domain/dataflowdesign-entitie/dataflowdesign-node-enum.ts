/***
 * 节点类型
 */
export enum NodeTypeEnum {
    /**
     * 开始节点
     */
    startNode = 0,
    /**
     * 运转节点
     */
    workNode = 5,
    /**
     * 结束节点
     */
    endNode = 10,
}
/**
* 节点形状类型
*/
export enum ENodeShape {
    circle,
    rect,
    polygon
}