import { Graph, Shape } from "@antv/x6";
import { circleNodeBaseConfig, edgeBaseConfig, rectNodeBaseConfig } from "./antvx6elementdefaultconfig";

import IGraphConfig from "./antvx6graphconfig";

/**
 * Antv/X6工厂
 */
export default class GraphFactory {
    /**
     * 创建画布
     * @param _graph 
     */
    static createGraph(_graph: IGraphConfig): Graph {
        const container = this.getcontainerHtml(_graph.container);
        const containerHtml = document.getElementById("graph");
        const width: number =
            containerHtml !== null ? containerHtml.clientWidth : 1450;
        const height: number =
            containerHtml !== null ? containerHtml.clientHeight : 750;
        const minimap =
            _graph.miniMapContainer !== "undefined"
                ? this.getcontainerHtml(_graph.miniMapContainer!)
                : undefined;
        this.InitGraphStyle();
        const graph = new Graph({
            container: container!,
            grid: {
                size: 10, // 网格大小 10px
                visible: true, // 绘制网格，默认绘制 dot 类型网格
                type: "mesh",
                args: {
                    color: "#ddd", // 网格线/点颜色
                    thickness: 1, // 网格线宽度/网格点大小
                },
            },
            snapline: true,//启用对齐线
            history: true,
            clickThreshold: 1, //当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。
            width: width,
            height: height,
            /**
             * 拖放功能
             */
            scroller: {
                enabled: true,
                pageVisible: true,
                pageBreak: false,
                pannable: true,
            },
            /**
             * 是否高亮
             */
            // highlighting: {
            //   // nodeAvailable: {
            //   //   name: 'className',
            //   //   args: {
            //   //     className: 'available',
            //   //   },
            //   // },
            //   magnetAvailable: {
            //     name: 'className',
            //     args: {
            //       className: 'available',
            //     },
            //   },
            //   magnetAdsorbed: {
            //     name: 'className',
            //     args: {
            //       className: 'adsorbed',
            //     },
            //   },
            // },
            /**
             * 小地图
             */
            minimap: {
                enabled: minimap !== null ? true : false,
                container: minimap!,
                width: 200,
                height: 200,
                padding: 10,
                minScale: 10,
            },
            /**
             * 多选和单选节点
             */
            // selecting: {
            //   enabled: true,
            //   multiple: true,
            //   rubberband: true,
            //   movable: true,
            // selectCellOnMoved: true,
            // showNodeSelectionBox: true,
            // showEdgeSelectionBox: true
            // },
            /**
             * 鼠标滚轮加ctrl 放大或缩小
             */
            mousewheel: {
                enabled: true,
                modifiers: ["ctrl", "meta"],
            },
            /**
             *
             */
            connecting: {
                dangling: false, // 边的起点或者终点只能是节点或者连接桩。
                snap: true,//当 snap 设置为 true 时连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
                connectionPoint: "boundary",//指定连接点，默认值为 boundary。//anchor
                anchor: "center",// 不允许连接到节点上(只能连接到连接桩上)
                allowNode: false,//不允许连接到节点上(只能连接到连接桩上)
            },
        });
        graph.drawBackground({
            color: "#fff",
        });
        window.addEventListener("resize", () => {
            const resizecontainerHtml = document.getElementById("graph");
            const resizewidth: number =
                resizecontainerHtml !== null ? resizecontainerHtml.clientWidth : 1450;
            const resizeheight: number =
                resizecontainerHtml !== null ? resizecontainerHtml.clientHeight : 750;
            // console.log(resizewidth, resizeheight);
            graph.resize(resizewidth, resizeheight);
        });
        return graph;
    }
    private static getcontainerHtml(_containerid: string): HTMLElement | null {
        return document.getElementById(_containerid);
    }
    private static InitGraphStyle() {
        /**
         * 设置Edge默认样式及通用属性
         */
        Shape.Edge.config(edgeBaseConfig);
        /**
         * 设置Rect默认样式及通用属性
         */
        Shape.Rect.config(rectNodeBaseConfig);
        /**
         * 设置Circle默认样式及通用属性
         */
        Shape.Circle.config(circleNodeBaseConfig);
    }
}