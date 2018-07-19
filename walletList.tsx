import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Toolbar from "@material-ui/core/Toolbar"
import AddIcon from "@material-ui/icons/Add"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"
// tslint:disable:object-literal-sort-keys

const styles = createStyles({
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
})

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

    public renderWallet(wallet: {name: string, address: string}) {
        return (
            <Link to="/wallet" style={{ textDecoration: "none" }}>
            </Link>
        )
    }

    public render() {
        return (
            <div style={styles.root}>
                <AppBar position="static">
                    <Toolbar style={{ justifyContent: "space-between" }}>
                        <Button style={styles.menuButton} color="inherit">HYCON LOGO</Button>
                        <Button color="inherit">EN</Button>
                    </Toolbar>
                </AppBar>
                <List
                    subheader={
                        <ListSubheader component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Wallets</span>
                            <div>
                                <span><IconButton aria-label="Edit"><EditIcon style={{ fontSize: 18 }} /></IconButton></span>
                                <span><IconButton aria-label="Add"><AddIcon style={{ fontSize: 18 }} /></IconButton></span>
                            </div>
                        </ListSubheader>
                    }>
                    <Divider/>
                    {this.state.wallets.map((n) => (
                        <div style={{ background: "#FFF" }}>
                            <ListItem key={`item-${n}`}>
                                <ListItemText primary={n.name} secondary={n.address} />
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </div>

        )
    }

    private setWallets(wallets: IHyconWallet[]) {
        this.setState({ wallets })
    }
}
