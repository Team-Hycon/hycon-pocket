import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IRest } from "../rest"
import { AddWallet } from "./addWallet"
import { ClaimWallet } from "./claimWallet"
import { SendHyc } from "./sendHyc"
import { WalletActivity } from "./walletActivity"
import { WalletList } from "./walletList"
import { WalletView } from "./walletView"

interface IProps {
    rest: IRest
}
interface IState {
    language: IText
    languageSelect: string
    loading: boolean
}
export class MobileApp extends React.Component<IProps, IState & IProps> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        const languageSelect = navigator.language.split("-")[0]
        return {
            language: getLocale(navigator.language),
            languageSelect,
            loading: false,
            rest: nextProps.rest,
        }
    }
    public notFound: boolean

    constructor(props: IProps) {
        super(props)
    }

    public render() {
        if (this.state.loading) {
            return <div>Loading</div>
        }
        return (
            <Switch>
                <Route exact path="/" component={() => <WalletList rest={this.state.rest} language={this.state.language} />} />
                <Route exact path="/wallet" component={() => <WalletView rest={this.state.rest} language={this.state.language} />} />
                <Route exact path="/claim" component={() => <ClaimWallet rest={this.state.rest} language={this.state.language} />} />
                <Route exact path="/addwallet" component={() => <AddWallet rest={this.state.rest} language={this.state.language} />} />
                <Route exact path="/sendcoins" component={() => <SendHyc rest={this.state.rest} language={this.state.language} />} />
                <Route exact path="/walletactivity" component={() => <WalletActivity rest={this.state.rest} language={this.state.language} />} />
            </Switch>
        )
    }
}
