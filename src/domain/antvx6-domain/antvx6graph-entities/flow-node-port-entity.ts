import { Guid } from 'guid-typescript';
import { IEntity } from '../../../shard/entity/ibaseentity';

export class Ports  {
    /**
     * 连接装群组
     */
    //groups: IGroups//暂时弃用
    /**
     * 节点Id和分组关系
     */
    items:Array<GroupsRelation>=Array<GroupsRelation>();
}
/**
 * 分组关系
 */
export class  GroupsRelation implements IEntity<string>{
    id: string=Guid.EMPTY;
    /**
     * 分组名称
     */
    group:string="";
}