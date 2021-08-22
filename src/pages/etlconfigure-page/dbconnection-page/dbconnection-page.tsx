import { Button, PaginationProps, Row, Spin, Table, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import DBconnectionMetadata from "./dbconnection-metadata"
import DbconnectionOperation from "./dbconnection-operation"
import { Guid } from "guid-typescript";
import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice";
import { IOperationConfig } from "../../../shard/operation/operationConfig"
import { IocTypes } from "@/shard/inversionofcontrol/ioc-config-types";
import { TreeDto } from "../../../shard/entity/treedto"
import { initPaginationConfig } from "@/shard/ajax/request";
import useHookProvider from "@/shard/dependencyInjection/ioc-hook-provider";
import { useMemo } from "react";
import { OperationTypeEnum } from "@/shard/operation/operationType";

const Dbconnectionpage = () => {
  const _dbconnectionservice: IDbConnectionService = useHookProvider(
    IocTypes.DbConnectionService
  );
  const [loading, setloading] = useState<boolean>(true);
  const [OperationState, setOperationState] = useState<IOperationConfig>({
    itemId: Guid.EMPTY,
    title: "",
    visible: false,
    operationType: OperationTypeEnum.view
  })
  const [currentId, setCurrentIdState] = useState<string>("")
  const [metadataArrayTree, setMetadataArrayTree] = useState<Array<TreeDto>>([]);
  const [importMetadataState, setImportMetadataState] = useState<IOperationConfig>({
    itemId: Guid.EMPTY,
    title: "",
    visible: false,
    operationType: OperationTypeEnum.import
  })
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState<PaginationProps>(
    initPaginationConfig
  );
  /**
   * Table 列名
   */
  const columns = [
    {
      title: "链接名称",
      dataIndex: "connectionName",
      key: "connectionName",
    },
    {
      title: "密码",
      dataIndex: "passWord",
      key: "passWord",
    },
    {
      title: "主机",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: any) => {
        return <div>
          <Button
            type="primary"
            onClick={() => { importMetadataClick(record) }}>
            导入
          </Button>
        </div>
      }
    }
  ];
  /**
   * 添加/修改组件
   */
  const renderOperation = useMemo(() => {
    return (<DbconnectionOperation Config={OperationState}></DbconnectionOperation>)
  }, [OperationState])
  /**
   * 导入元数据组件
   */
  const importMetadata = useMemo(() => {
    return (<DBconnectionMetadata Config={importMetadataState} connId={currentId} TreeArr={metadataArrayTree} ></DBconnectionMetadata>)
  }, [importMetadataState])
  /**
   * 按钮事件
   */
  const onButtonClick = () => {
    setOperationState({
      itemId: Guid.EMPTY,
      title: "添加连接",
      visible: true,
      operationType: OperationTypeEnum.add,
      onClose: () => {
        setOperationState({
          itemId: Guid.EMPTY,
          title: "",
          visible: false,
        })
      }
    })
  }
  /**
   * 导入元数据
   * @param _row 
   */
  const importMetadataClick = (_row: any) => {
    setCurrentIdState(_row.id)
    _dbconnectionservice.getmetadata().then(result => {
      if (result.success) {
        setMetadataArrayTree(result.data)
        setImportMetadataState({
          itemId: Guid.EMPTY,
          title: "导入元数据",
          visible: true,
          operationType: OperationTypeEnum.import,
          onClose: () => {
            setImportMetadataState({
              itemId: Guid.EMPTY,
              title: "",
              visible: false,
            })
          }
        })
      }
    })
  }
  /**
   * 页面初始化事件
   */
  useEffect(() => {
    getTable();
  }, [pagination]);
  /**
   * 页面初始化获取数据
   */
  const getTable = async () => {
    try {
      _dbconnectionservice.getPage().then((x) => {
        if (x.success) {
          setPagination((Pagination) => {
            Pagination.total = x.total;
            return Pagination;
          });
          x.data.map((item: any, index: number) => {
            item.key = item.id;
            return item;
          });
          setTableData(x.data);
          setloading(false);
        }
      });
    } catch (error) {
      message.error(error);
    }
  };
  return (
    <div>
      <div>
        <Row>
          <Button type="primary" onClick={() => onButtonClick()}>添加</Button>
        </Row>
      </div>
      <Table bordered columns={columns} dataSource={tableData} loading={loading} pagination={pagination} />
      {renderOperation}
      {importMetadata}
    </div>
  );
};
export default Dbconnectionpage;
