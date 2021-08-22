import { Guid } from 'guid-typescript';

const nodePortsConfig = {
    ports: {
        groups: {
            left: {
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: "#5f95ff",
                        strokeWidth: 1,
                        fill: "#fff",
                        visibility: "hidden"
                    },
                },
                position: "left",
            },
            top: {
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: "#5f95ff",
                        strokeWidth: 1,
                        fill: "#fff",
                        visibility: "hidden"
                    },
                },
                position: "top",
            },
            right: {
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: "#5f95ff",
                        strokeWidth: 1,
                        fill: "#fff",
                        visibility: "hidden"
                    },
                },
                position: "right",
            },
            bottom: {
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: "#5f95ff",
                        strokeWidth: 1,
                        fill: "#fff",
                        visibility: "hidden"
                    },
                },
                position: "bottom",
            },
        },
        items: [
            { id: Guid.create().toString(), group: "left" },
            { id: Guid.create().toString(), group: "top" },
            { id: Guid.create().toString(), group: "right" },
            { id: Guid.create().toString(), group: "bottom" },
        ],
    },
}
/**
 * 圆节点Body配置
 */
const circleBody = {
    body: {
        stroke: '#fb982c',
        strokeWidth: 1,
        fill: "rgba(251,152,44,0.05)"
    },
}
/**
 * 长方形节点Body配置
 */
const rectBody = {
    body: {
        fill: "rgba(95,149,255,0.05)",
        stroke: "#5f95ff",
        strokeWidth: 1,
        rx: 5, // 圆角
        ry: 5
    },
}
/**
 * Line 默认配置
 */
export const edgeBaseConfig = {
    router: "manhattan",
    attrs: {
        line: {
            stroke: "#5f95ff",
        }
    }
}
/**
 * 长方形节点默认配置
 */
export const rectNodeBaseConfig = {
    attrs: {
        ...rectBody,
        label: {
            x: 15,
            fill: "#6a6c8a",
            fontWeight: "bold"
        },
        image: {
            width: 30,
            height: 30,
            x: 5,
            y: 5
        }
    },
    ...nodePortsConfig,
    visible: true,
    zIndex: 1,
    x: 40, // Number，必选，节点位置的 x 值
    y: 40, // Number，必选，节点位置的 y 值
    width: 120, // Number，可选，节点大小的 width 值
    height: 40, // Number，可选，节点大小的 height 值
    markup: [
        {
            tagName: "rect",
            selector: "body"
        },
        {
            tagName: "image",
            selector: "image"
        },
        {
            tagName: "text",
            selector: "label"
        }
    ],
}
/**
 * 圆节点默认配置
 */
export const circleNodeBaseConfig = {
    attrs: {
        label: {
            fontSize: 12,
            fill: 'black',
            fontWeight: "bold"
        },
        ...circleBody,
        image: {
            width: 40,
            height: 40,
            x: 5,
            y: 5
        },
    },

    visible: true,
    zIndex: 1,
    x: 40, // Number，必选，节点位置的 x 值
    y: 40, // Number，必选，节点位置的 y 值
    width: 50, // Number，可选，节点大小的 width 值
    height: 50, // Number，可选，节点大小的 height 值
    parent: "",//
    markup: [
        {
            tagName: "circle",
            selector: "body"
        },
        {
            tagName: "image",
            selector: "image"
        },
        {
            tagName: "text",
            selector: "label"
        }
    ],
    ...nodePortsConfig,
}



