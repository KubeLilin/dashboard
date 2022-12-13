export type ProbeData = {
    dpId: number,
    enableReadiness: boolean,
    enableLiveness: boolean
    readiness: ProbeItem,
    liveness: ProbeItem
}

export type ProbeItem = {
    type: string,
    port: number,
    url: string,
    reqScheme: string
}

export type ProbeFormData = {
    dpId: number,

    enableLifecycle: boolean,
    enableReadiness: boolean,
    enableLiveness: boolean,

    terminationGracePeriodSeconds: number, // 定义在 deployment资源中
    lifecyclePreStop: string,        // 定义在容器中
    lifecyclePreStart: string,       // 

    readinessType: string,           // 定义在容器中
    readinessPort: number,
    readinessUrl: string,
    readinessReqScheme: string
    readinessInitialDelaySeconds: number,
    readinessTimeoutSeconds: number,
    readinessPeriodSeconds: number

    livenessType: string,            //定义在容器中
    livenessPort: number,
    livenessUrl: string,
    livenessReqScheme: string,
    livenessInitialDelaySeconds: number,
    livenessTimeoutSeconds: number,
    livenessPeriodSeconds: number

}