import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Route, Switch } from "react-router-dom"
import { IRest } from "../rest"
import { AddWallet } from "./addWallet"
import { Contacts } from "./contacts"
import { getMobileLocale, IText } from "./locales/m_locales"
import { SendHyc } from "./sendHyc"
import { Settings } from "./settings"
import WalletList from "./walletList"
import { WalletView } from "./walletView"
// tslint:disable:no-var-requires
const storage = window.localStorage

// tslint:disable:object-literal-sort-keys
interface IProps {
    rest: IRest
}
interface IState {
    loading: boolean
    name?: string
    wallet: any
    paletteType: string
}

export interface IPrice {
    fiat: any,
    eth: any,
    btc: any,
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
            paletteType: previousState.paletteType,
        }
    }

    public walletDetail: ({ match }: RouteComponentProps<{ name: string }>) => JSX.Element
    public notFound: boolean
    private language: IText
    private languageSelect: string
    private price: IPrice

    constructor(props: IProps) {
        super(props)
        this.language = getMobileLocale(navigator.language)
        this.languageSelect = navigator.language.split("-")[0]
        this.walletDetail = ({ match }: RouteComponentProps<{ name: string }>) => (
            <WalletView rest={this.state.rest} language={this.language} select={this.updateSelected.bind(this)} price={this.price} name={match.params.name} paletteType={this.state.paletteType} />
        )
        this.price = { fiat: 0, eth: 0, btc: 0 }
        this.state = {
            rest: this.props.rest,
            loading: false,
            name: "",
            wallet: null,
            paletteType: storage.getItem("paletteType") === null ? "light" : storage.getItem("paletteType"),
        }
    }

    public componentDidUpdate() {
        this.state.rest.getPrice(this.language.currency).then((price: number) => {
            this.price.fiat = price
        })
        this.state.rest.getPrice("eth").then((price: number) => {
            this.price.eth = price
        })
        this.state.rest.getPrice("btc").then((price: number) => {
            this.price.btc = price
        })
    }

    public render() {
        if (this.state.loading) {
            return <div>Loading</div>
        }
        let theme: any
        const typography = {
            fontFamily: this.languageSelect === "en" ?
                ["Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(",") :
                ["Nanum Gothic", "Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(","),
            fontWeightLight: 400,
            fontWeightMedium: 400,
            fontWeightRegular: this.languageSelect === "en" ? 600 : 700,
            useNextVariants: true,
        }

        {
            this.state.paletteType === "light" ?
                theme = createMuiTheme({
                    palette: {
                        type: "light",
                    },
                    typography,
                }) :
                theme = createMuiTheme({
                    palette: {
                        type: "dark",
                    },
                    typography,
                })
        }

        return (
            <MuiThemeProvider theme={theme}>
                <div style={{ backgroundColor: this.state.paletteType === "light" ? "white" : "#303030", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <CssBaseline />
                    <Switch>
                        <Route exact path="/" component={() => <WalletList rest={this.state.rest} language={this.language} languageSelect={this.languageSelect} languageChange={this.getLanguage.bind(this)} setPaletteType={this.setPaletteType.bind(this)} />} />
                        <Route exact path="/wallet/:name" component={this.walletDetail} />
                        {/* <Route exact path="/claim" component={() => <ClaimWallet rest={this.state.rest} language={this.language} wallet={this.state.wallet} />} /> */}
                        <Route exact path="/addwallet" component={() => <AddWallet rest={this.state.rest} language={this.language} />} />
                        <Route exact path="/sendcoins" component={() => <SendHyc rest={this.state.rest} language={this.language} wallet={this.state.wallet} />} />
                        <Route exact path="/contacts" component={() => <Contacts rest={this.state.rest} language={this.language} />} />
                        <Route exact path="/settings" component={() => <Settings rest={this.state.rest} language={this.language} />} />
                    </Switch>
                </div>
            </MuiThemeProvider>
        )
    }

    private setPaletteType() {
        const paletteType = this.state.paletteType === "light" ? "dark" : "light"
        this.setState({ paletteType })
        storage.setItem("paletteType", paletteType)
    }
    private updateSelected(wallet: any) {
        this.setState({ wallet })
    }

    private getLanguage(code: string) {
        this.language = getMobileLocale(code)
        this.languageSelect = code
        this.state.rest.getPrice(this.language.currency).then((price: number) => {
            this.price.fiat = price
        })
        this.forceUpdate()
    }
}
