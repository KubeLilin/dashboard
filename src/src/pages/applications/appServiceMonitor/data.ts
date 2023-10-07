
export type ServiceMonitorRequestData = {
    id: number,
    name: string,
    appId: number,
    clusterId: number,
    namespace : string,
    deploymentId: number,
    deploymentName: string,
    interval: number,
    port: string,
    path: string,
}