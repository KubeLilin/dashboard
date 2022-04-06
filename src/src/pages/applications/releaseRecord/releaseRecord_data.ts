export type ReleaseRecordItem = {
    id: number,
    appId: number,
    deploymentId: number,
    deploymentName: string,
    level:string,
    applyImage: string,
    opsType: string,
    operator: number,
    OperatorName: string,
    creationTime: Date
}