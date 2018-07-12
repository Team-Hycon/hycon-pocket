import { notification } from "onsenui"
import * as React from "react"
import { Button, List, ListHeader, ListItem, Page, Toolbar } from "react-onsenui"
import { RouteComponentProps } from "react-router"
import { Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"

interface IProps {
    rest: IRest
    language: IText
}
// tslint:disable-next-line:no-empty-interface
interface IState {
    wallets: IHyconWallet[]
}
export class WalletList extends React.Component<IProps, IState & IProps> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
            wallets: [
                { name: "Juwon", address: "H4JeK5zNNKtNzBdoqcTHV4s4wwtB58hrh" },
                { name: "Josiah", address: "H3vNt4mMDQuMUzAWdT6fhr5HZByuk2JzS" },
                { name: "Owen", address: "H3b2Wcz6LoLPpupVjsUNHF8uxHPXu8J6C" },
                { name: "Shawn", address: "H4PhGGqqkfmPu542EDHvVqtj9RYfA8BtQ" },
            ],
        })
    }

    constructor(props: IProps) {
        super(props)
        // props.rest.getWalletList().then((w) => this.setWallets(w.walletList))
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public renderToolbar() {
        return (
            <Toolbar>
                <div className="left">Hycon Logo</div>
                <div className="center">_</div>
                <div className="right">En</div>
            </Toolbar>
        )
    }
    public renderWallet(wallet: {name: string, address: string}) {
        return (
            <ListItem>
                wallet.name
                wallet.address
            </ListItem>
        )
    }

    public render() {
        return (
            <div>
                <Page renderToolbar={ () => this.renderToolbar()}>
                    <List
                        dataSource={this.state.wallets}
                        renderHeader={() => <ListHeader>Wallets</ListHeader>}
                        renderRow={(wallet) => this.renderWallet(wallet)}
                    />
                </Page>
            </div>
        )
    }

    private setWallets(wallets: IHyconWallet[]) {
        this.setState({ wallets })
    }
}
