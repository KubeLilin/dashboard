import { Button, Modal, Tree } from "antd"
import React, { useEffect, useState } from 'react'

import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice"
import { IOperationConfig } from "../../../shard/operation/operationConfig"
import { IocTypes } from "@/shard/inversionofcontrol/ioc-config-types"
import { MetaDataImportInputDto, MetaDataInputDto, MetaDataTypeEnum } from "@/domain/dbconnection-domain/dbconnection-entitie/dbconnResourceentities"
import { TreeDto } from "../../../shard/entity/treedto"
import useHookProvider from "@/shard/dependencyInjection/ioc-hook-provider"

interface IProp {
    Config: IOperationConfig;
    TreeArr: Array<TreeDto>
    connId: string
}

const DBconnectionMetadata = (props: IProp) => {
    const _dbconnectionservice: IDbConnectionService = useHookProvider(IocTypes.DbConnectionService);
    const [treeSelected, setTreeSelected] = useState<Array<MetaDataInputDto>>([]);
    const onCancel = () => {
        if (props.Config.onClose) {
            props.Config.onClose();
        }
    };
    const treeChecked = (data: any, e: any) => {
        console.log(data, e.checkedNodes)
        const checkedlist: Array<MetaDataInputDto> = [];
        const current = e.checkedNodes;
        current.forEach((x: TreeDto) => {
            if (x.metaDataType === MetaDataTypeEnum.metaDataColunm)
                checkedlist.push({ name: x.key.split('-')[1], MetaDataType: x.metaDataType });
            else
                checkedlist.push({ name: x.key, MetaDataType: x.metaDataType });
        })
        // console.log(checkedlist)
        setTreeSelected(checkedlist)
    }
    const onOk = () => {
        const input = new MetaDataImportInputDto();
        input.id = props.connId;
        input.metaDatas = treeSelected;
        _dbconnectionservice.importmetadata(input)

    }
    return (
        <div>
            <Modal width={1000} title={props.Config.title} visible={props.Config.visible} onCancel={onCancel}
                footer={[
                    <Button key="back" onClick={onCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={onOk}>保存</Button>
                ]}>
                <Tree height={600}
                    checkable
                    onCheck={treeChecked}
                    treeData={props.TreeArr} />
            </Modal>
        </div>
    )
}

export default DBconnectionMetadata
