import React from 'react';
import { Menu,Space } from 'antd';
import { BrowserRouter as Router, Route, Link,useHistory } from 'react-router-dom';
import { LeftCircleFilled } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-card';
import { history, Link as UmiLink } from 'umi';

import Nodes from '../nodes'

const { SubMenu } = Menu;

const ClusterInfo: React.FC = () => {
  const cid = history.location.query?.cid
  const clusterName = history.location.query?.name
  const clusterNickName = history.location.query?.nickname

  let routeHistory = useHistory()

  return (
    <div style={{height:'100%',width:'100%'}}>
    <Router History={routeHistory}>
      <ProCard split="vertical" style={{height:'100%'}}>
      <ProCard colSpan="16%" style={{height:'100%'}} bordered={false}>
        
        <div style={{height:70,fontSize:16 }}>
          <Space direction='vertical'>
          <a   onClick={()=>{
            history.push('/resources/clusters')
          }}> <LeftCircleFilled /> 返回集群</a>
          <span> {clusterNickName}{clusterName}</span>
          </Space>

        </div>
        <Menu mode="inline"   defaultOpenKeys={["base","wordload"]} defaultSelectedKeys={['node']} >
            <SubMenu key="base" title="基本信息">
              {/* <Menu.Item key="home">
                <Link to="/">基本信息</Link>
              </Menu.Item> */}
              <Menu.Item key="node">
                <Link to={'/resources/clusterinfo?cid='+cid}>节点管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="wordload" title="工作负载 (Workload)"  >

              <Menu.Item key="deployment">
                <Link to="/product2">Deployment</Link>
              </Menu.Item>
              <Menu.Item key="statefulset">
                <Link to="/product2">StatefulSet</Link>
              </Menu.Item>
              <Menu.Item key="daemonset">
                <Link to="/product2">DaemonSet</Link>
              </Menu.Item>
              <Menu.Item key="cronjob">
                <Link to="/product2">CronJob</Link>
              </Menu.Item>
              <Menu.Item key="job">
                <Link to="/product2">Job</Link>
              </Menu.Item>


            </SubMenu>
          </Menu>
      </ProCard>
      <ProCard  bordered={false}  >

           <Route exact path={"/resources/clusterinfo"}  component={Nodes}  />

           <Route exact  path="/" component={Home} />

           <Route exact path="/product2" component={Product2} />
     
      </ProCard>
    </ProCard>    
    </Router>
    </div>
  )
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to our website!</p>
    </div>
  );
}

function Product1() {
  return (
    <div>
      <h2>Product 1</h2>
      <p>This is the first product.</p>
    </div>
  );
}

function Product2() {
  return (
    <div>
      <h2>Product 2</h2>
      <p>This is the second product.</p>
    </div>
  );
}

export default ClusterInfo