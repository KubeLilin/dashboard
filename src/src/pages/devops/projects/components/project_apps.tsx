import React, { useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ApplicationItem } from '../../../applications/apps/apps_data';
import {  getAppLevel } from '../../../applications/apps/apps_service';

import { Link } from 'umi';

export const AppsColumns: ProColumns<ApplicationItem>[] = [
    {
        title: 'id',
        dataIndex: 'id',
        width: 48,
        hideInForm: true,
        hideInSearch: true
    },
    {
        title: '应用名称',
        dataIndex: 'name',
        render: (dom, row) => {
            return <Link key={'linkapp' + row.id} style={{  textDecorationLine: 'underline' }} to={'/applications/info?id=' + row.id + '&name=' + row.name}>{dom}</Link>
        }
    },
    {
        title: '租户id',
        dataIndex: 'tenantId',
        hideInTable: true,
        hideInForm: true,
        hideInSearch: true
    },
    {
        title: "标签",
        dataIndex: 'labels',
    }, {
        title: "Git地址",
        dataIndex: 'git',
        hideInSearch: true,
        render: (dom, row) => {
            return <a key={'gitlink' + row.id} href={row.git} target="_blank">{dom}</a>
        }
    }, {
        title: '级别',
        dataIndex: 'level',
        hideInTable: true,
        valueType: 'select',
        request: getAppLevel
    }, {
        title: '级别',
        dataIndex: 'levelName',
        hideInSearch: true
    }, {
        title: '语言',
        dataIndex: 'languageName',
        hideInSearch: true
    },
    {
        title: "备注",
        dataIndex: 'remarks',
        hideInSearch: true

    }, {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
            '0': { text: '停用' },
            '1': { text: '启用' }
        }
    }, {
        title: '操作',
        valueType: 'option',
        render: (text, record, _, action) => [
            <Link key={"link-id" + record.id} to={'/applications/info?id=' + record.id + '&name=' + record.name}>进入应用</Link>]
    }
]


