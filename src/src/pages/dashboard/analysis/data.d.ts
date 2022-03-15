
export type ProjectsMetricsInfo = {
  publish: number;
  applications: number;
  deploys: number;
}


export type WorkloadsMetricsInfo = {
  podsRunning: number;
  podsCount: number;
  deployment: number;
  statefulSets: number;
  daemonSets: number;
  replicaSets: number;
  cronJobs: number;
  jobs: number;
}


export type ClusterMetricsInfo = {
  usage:MetricsItem;
  allocatable:MetricsItem;
  capacity:MetricsItem;
  nodes:NodeStatus;
}


export type MetricsItem = {
  cpu:number;
  memory:number;
  storage:number;
  pods:number;
}

export type NodeStatus = {
  available:number;
  count:number;
}

