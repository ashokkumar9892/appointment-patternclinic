import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import routes from "./allroutes";

function ParamsExample() {
    return (
        <Router> 
                <Switch>
                    {
                        routes.map((routes, i) => {
                            return (
                                <Route key={i}
                                    path={routes.path}
                                    exact={routes.exact}
                                    strict={routes.strict}
                                    children={<routes.component />}
                                />
                            )

                        })
                    }
                    <Redirect path="*" to="/" />
                </Switch>
        </Router>
    )
}
export default ParamsExample