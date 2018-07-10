import "onsenui/css/onsen-css-components.css"
import "onsenui/css/onsenui.css"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Page } from "react-onsenui"
import {  HashRouter } from "react-router-dom"
import { RestChrome } from "../restChrome"
import { MobileApp } from "./mobileClient"

const rest = new RestChrome()

ReactDOM.hydrate(
    <Page>
        <HashRouter>
            <MobileApp rest={rest} />
        </HashRouter>
    </Page>,
    document.getElementById("blockexplorer"),
)
