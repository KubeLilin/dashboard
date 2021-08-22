/**
 * 任务类型
 */
export enum TaskTypeGroupEnum {
    /**
     * 数据库导入数据库任务
     */
    input = 0,
    /**
     * Http任务
     */
    outPut = 5,
}
/**
 * 任务类型
 */
 export enum TaskTypeEnum {
    /**
     * 数据库导入数据库任务
     */
    dataBase = 0,
    /**
     * Json文件导入到数据库
     */
    ftpjson=5,
    /**
     * Excel输入
     */
    excel=10,
}

/**
 * 目标表写入前操作类型
 */
export enum TargerWriteBeforOperationType{
    /**
     * 不删除任何数据
     */
    DoNotDeleteAnyData=0,
    /**
     * 删除已有数据
     */
    DeleteExistingData=5,
    /**
     * 删除本批数据
     */
    DeleteThisBatchData=10,
    /**
     * 清空目标表数据
     */
    ClearTargetTableData=15,
    /**
     * 自定义删除语句
     */
    CustomDeleteStatement=20,
}

/**
 * Json文件来源类型
 */
 export enum InputType{
    /**
     * FTP下载文件解析
     */
    FtpDownLoad=0,
}

