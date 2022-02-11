export type StageItem = {
    name: string,
    steps: StepItem[],
}

export type StepItem = {
    name : string,
    key : string,
    content?: any,
}