export type NodeItem = {
    uid: string,
    name: string,
    podCIDR: string,
    osImage: string,
    kubeletVersion: string,
    containerRuntimeVersion: string,
    operatingSystem: string,
    architecture: string,
    usage: NodeStatus,
    capacity: NodeStatus,
    allocatable: NodeStatus,
    addresses : NodeAddress[],
    status: string
}

export type NodeStatus  = {
    cpu : number,
    memory: number,
    pods: number,
    storage:number
}

export type NodeAddress = {
    type: string,
    address: string
}