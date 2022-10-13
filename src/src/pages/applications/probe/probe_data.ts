export type ProbeData={
    dpId:number,
    enableReadiness:boolean,
    enableLiveness:boolean
    readiness:ProbeItem,
    liveness:ProbeItem
}

export type ProbeItem={
    type:string,
    port:number,
    url:string,
    reqScheme:string
}

export type ProbeFormData={
    dpId:number,
    enableReadiness:boolean,
    enableLiveness:boolean,
    readinesstype:string,
    readinessPort:number,
    readinessUrl:string,
    readinessReqScheme:string
    readinessInitialDelaySeconds:number,
    readinessPeriodSeconds:number
    livenesstype:string,
    livenessport:number,
    livenessurl:string,
    livenessreqScheme:string,
    livenessInitialDelaySeconds:number,
    livenessPeriodSeconds:number

}