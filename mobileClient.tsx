import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Route, Switch } from "react-router-dom"
import { getMobileLocale, IText } from "../locales/mobile/m_locales"
import { IRest } from "../rest"
import { AddWallet } from "./addWallet"
import { ClaimWallet } from "./claimWallet"
import { Contacts } from "./contacts"
import { SendHyc } from "./sendHyc"
import { WalletList } from "./walletList"
import { WalletView } from "./walletView"

// tslint:disable:object-literal-sort-keys
interface IProps {
    rest: IRest
}
interface IState {
    loading: boolean
    name?: string
    wallet: any
}

export class MobileApp extends React.Component<IProps, IState & IProps> {

    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        let wall
        if (previousState != null) {
            wall = previousState.wallet
        }
        return {
            loading: false,
            wallet: wall,
            name: "",

            rest: nextProps.rest,
        }
    }

    public walletDetail: ({ match }: RouteComponentProps<{ name: string }>) => JSX.Element
    public notFound: boolean
    private language: IText
    private languageSelect: string

    constructor(props: IProps) {
        super(props)
        this.language = getMobileLocale(navigator.language)
        this.languageSelect = navigator.language.split("-")[0]
        this.walletDetail = ({ match }: RouteComponentProps<{ name: string }>) => (
            <WalletView rest={this.state.rest} language={this.language} select={this.updateSelected.bind(this)} name={match.params.name} />
        )

    }
    public render() {
        if (this.state.loading) {
            return <div>Loading</div>
        }
        return (
            <Switch>
                <Route exact path="/" component={() => <WalletList rest={this.state.rest} language={this.language} languageSelect={this.languageSelect} languageChange={this.getLanguage.bind(this)}/>} />
                <Route exact path="/wallet/:name" component={this.walletDetail} />
                <Route exact path="/claim" component={() => <ClaimWallet rest={this.state.rest} language={this.language} wallet={this.state.wallet} />} />
                <Route exact path="/addwallet" component={() => <AddWallet rest={this.state.rest} language={this.language} />} />
                <Route exact path="/sendcoins" component={() => <SendHyc rest={this.state.rest} language={this.language} wallet={this.state.wallet} />} />
                <Route exact path="/contacts" component={() => <Contacts rest={this.state.rest} language={this.language} />} />
            </Switch>
        )
    }
    private updateSelected(wallet: any) {
        this.setState({ wallet })
    }

    private getLanguage(code: string) {
        this.language = getMobileLocale(code)
        this.languageSelect = code
        this.forceUpdate()
    }
}
