import { BrowserRouter, Switch } from "react-router-dom";
import React, { Suspense } from "react";

import DynamicAuthRouter from "@/component/dynamicAuthRouter"
import Login from "@/router/constans/login"

const routes = [
    ...Login,
    // ...NotFound
];
class BasicRoute extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Suspense fallback={<div>Loading....</div>}>
                        <DynamicAuthRouter config={routes} />
                    </Suspense>
                </Switch>
            </BrowserRouter>
        )
    }
}
export default BasicRoute;