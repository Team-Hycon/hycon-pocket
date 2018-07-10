import { notification } from "onsenui"
import * as React from "react"
import {Button} from "react-onsenui"
import { RouteComponentProps } from "react-router"
import { Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IRest } from "../rest"

interface IProps {
    rest: IRest
    language: IText
}
// tslint:disable-next-line:no-empty-interface
interface IState {
}
export class WalletList extends React.Component<IProps, IState & IProps> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
            // nextState derived from nextProps
        })
    }

    constructor(props: IProps) {
        super(props)
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public render() {
        return (
            <div>
                <Button onClick={() => alert("Test")}>Web</Button>
                <Button onClick={() => notification.alert("Test")}>Onsen UI</Button>
            </div>
        )
    }
}
