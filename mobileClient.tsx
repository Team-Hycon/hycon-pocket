import AppBar from "@material-ui/core/AppBar"
import Avatar from "@material-ui/core/Avatar"
import Collapse from "@material-ui/core/Collapse"
import CssBaseline from "@material-ui/core/CssBaseline"
import Dialog from "@material-ui/core/Dialog"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import Grid from "@material-ui/core/Grid"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import MenuItem from "@material-ui/core/MenuItem"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import createStyles from "@material-ui/core/styles/createStyles"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import ContactsIcon from "@material-ui/icons/ContactsOutlined"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import DarkOnIcon from "@material-ui/icons/InvertColors"
import DarkOffIcon from "@material-ui/icons/InvertColorsOff"
import LanguageIcon from "@material-ui/icons/LanguageOutlined"
import MenuIcon from "@material-ui/icons/Menu"
import SettingsIcon from "@material-ui/icons/Settings"
import classnames from "classnames"
import * as React from "react"
import { Link } from "react-router-dom"
import { Route, Switch } from "react-router-dom"
import { IHyconWallet, IResponseError, IRest } from "../rest"
import { AddWallet } from "./addWallet"
import Contacts from "./contacts"
import Onboarding from "./content/onboarding"
import { Giftcard } from "./giftcard"
import { getMobileLocale, IText } from "./locales/m_locales"
import SendHyc from "./sendHyc"
import Settings from "./settings"
import WalletView from "./walletView"

declare var navigator: any
declare var window: any
// tslint:disable:no-var-requires
const logoWhite = require("./img/logo-w.png")
const logoColor = require("./img/logo-c.png")
const lock = require("./img/onboarding-lock.png")
const permanentDrawerWidth = 300
let temporaryDrawerWidth = window.innerWidth * 0.8
const storage = window.localStorage
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor)

const styles = (theme: Theme) => createStyles({
    appBar: {
        backgroundColor: "transparent",
        paddingTop: "env(safe-area-inset-top)",
        width: "100%",
        zIndex: theme.zIndex.drawer + 1,
    },
    avatar: {
        backgroundColor: "#e2e2e2",
        color: "#424242",
        fontSize: "0.8em",
    },
    avatarSmall: {
        fontSize: "0.6em",
        height: "30px",
        margin: "0 5px",
        width: "30px",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "scroll",
        overflowScrolling: "touch",
        [theme.breakpoints.up("sm")]: {
            marginLeft: permanentDrawerWidth,
        },
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            flexShrink: 0,
            width: permanentDrawerWidth,
        },
    },
    expand: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
        [theme.breakpoints.up("sm")]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up("sm")]: {
            display: "none",
        },
    },
    permanentDrawerPaper: {
        width: permanentDrawerWidth,
    },
    root: {
        background: "-webkit-linear-gradient(top, #0095a1 0%,#172349 100%)",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflowY: "scroll",
    },
    toolbar: theme.mixins.toolbar,
})

interface IProps extends WithStyles<typeof styles> {
    paletteType: string
    rest: IRest
    theme: Theme
    changeLanguage: (language: string) => void
    setPaletteType: () => void
}

export interface IPrice {
    fiat: any,
    eth: any,
    btc: any,
}

class MobileApp extends React.Component<IProps, any> {
    private language: IText
    private languageSelect: string
    private price: IPrice

    constructor(props: IProps) {
        super(props)
        this.language = getMobileLocale(navigator.language)
        this.languageSelect = navigator.language.split("-")[0]
        this.price = { fiat: 0, eth: 0, btc: 0 }
        this.state = {
            classes: this.props.classes,
            confirmAppExit: false,
            fingerprintAuth: false,
            name: "",
            oneHanded: storage.getItem("oneHanded") === null ? false : (storage.getItem("oneHanded") === "true"),
            openDialog: false,
            openMenu: false,
            openOnboarding: storage.getItem("onboarding") === null ? true : false,
            openWalletList: false,
            rest: this.props.rest,
            selectedWalletIndex: storage.getItem("selectedWalletIndex") === null ? 0 : Number(storage.getItem("selectedWalletIndex")),
            showBalance: storage.getItem("showBalance") === null ? true : (storage.getItem("showBalance") === "true"),
            wallet: { name: "", passphrase: "", password: "", hint: "", mnemonic: "", address: "", balance: "0", txs: [], pendings: [], language: "", pendingAmount: "0" },
            wallets: [],
        }
        if (storage.getItem("fingerprint") === "true") {
            window.Fingerprint.show({
                clientId: "Hycon Pocket",
                clientSecret: "2.0.0",
            }, () => { this.setState({ fingerprintAuth: true }) }, () => { setTimeout(() => { navigator.app.exitApp() }, 1500) })
        }
    }

    public componentDidMount() {
        document.addEventListener("backbutton", (event) => {
            event.preventDefault()
            if (window.location.hash === "#/") {
                { this.state.confirmAppExit ? navigator.app.exitApp() : this.setState({ confirmAppExit: true }) }
                window.plugins.toast.showShortBottom(this.language["ph-press-back-again"])
            }
            window.setTimeout(() => { this.setState({ confirmAppExit: false })}, 1000)
            return
        }, false)

        this.props.rest.getWalletList().then((data: any) => {
            if (data.walletList.length !== 0) {
                const walletName = data.walletList[this.state.selectedWalletIndex].name

                this.setState({
                    name: walletName,
                    wallets: data.walletList,
                })

                this.updateSelected(walletName)
            }
        })

        this.props.rest.getPrice(this.language.currency).then((price: number) => {
            this.price.fiat = price
        })
        this.props.rest.getPrice("eth").then((price: number) => {
            this.price.eth = price
        })
        this.props.rest.getPrice("btc").then((price: number) => {
            this.price.btc = price
        })
    }

    public componentWillUnmount() {
        document.removeEventListener("backbutton", (event) => {
            event.preventDefault()
            if (window.location.hash === "#/") {
                { this.state.confirmAppExit ? navigator.app.exitApp() : this.setState({ confirmAppExit: true }) }
                window.plugins.toast.showShortBottom("Press back again to exit")
            }
            window.setTimeout(() => { this.setState({ confirmAppExit: false }) }, 1000)
            return
        }, false)
    }

    public renderWallets() {
        return (
            <Grid container direction={this.state.oneHanded ? "column-reverse" : "column" } justify="flex-start" style={{ height: "100%", overflowY: "scroll", paddingTop: "env(safe-area-inset-top)" }}>
                <List style={{ width: "100%" }}>
                    <Hidden xsDown implementation="js">
                        <ListItem>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ paddingRight: 8 }}>
                                    <img style={{ maxHeight: 38 }} src={this.props.paletteType === "light" ? logoColor : logoWhite} />
                                </span>
                            </div>
                        </ListItem>
                    </Hidden>
                    {this.state.wallets.length === 0 ?
                        <ListItem button disabled={this.state.openOnboarding} component={({ innerRef, ...props }) => <li><Link to="/addwallet" {...props} style={{ float: "none" }} onClick={() => this.handleDialog(true)} /></li>}>
                            <Avatar className={this.props.classes.avatar}><AddIcon /></Avatar>
                            <ListItemText primary={this.language["no-wallet"]} />
                        </ListItem> :
                        <div>
                            <ListItem onClick={this.toggleWalletList(!this.state.openWalletList)}>
                                <Avatar className={this.props.classes.avatar}>{this.state.wallets[this.state.selectedWalletIndex].address.substring(0, 4)}</Avatar>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography variant="body2">
                                            {this.state.wallets[this.state.selectedWalletIndex].name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" noWrap>
                                            {this.state.wallets[this.state.selectedWalletIndex].address}
                                        </Typography>
                                    }
                                />
                                <IconButton
                                    className={classnames(this.props.classes.expand, {
                                        [this.props.classes.expandOpen]: this.state.openWalletList,
                                    })}
                                    onClick={this.toggleWalletList(!this.state.openWalletList)}
                                    aria-expanded={this.state.openWalletList}
                                    aria-label="Show more"
                                ><ExpandMoreIcon />
                                </IconButton>
                            </ListItem>
                            <Collapse in={this.state.openWalletList}>
                                <Divider style={{ margin: "10px 0 10px 70px" }} />
                                {this.state.wallets.filter((wallet) => wallet !== this.state.wallets[this.state.selectedWalletIndex]).map((n: { name: string, address: string }) => (
                                    <ListItem
                                        button
                                        key={`${n.name}`}
                                        onClick={this.handleWalletSelect(n.name)}
                                    >
                                        <Avatar className={this.props.classes.avatarSmall}>{n.address.substring(0, 4)}</Avatar>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography variant="body2">
                                                    {n.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" noWrap>
                                                    {n.address}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                                <ListItem button component={({ innerRef, ...props }) => <Link to="/addwallet" {...props} onClick={() => this.handleDialog(true)} />} style={{ paddingTop: 20 }}>
                                    <AddIcon className={this.props.classes.avatarSmall} style={{ color: this.props.paletteType === "light" ? "#616161" : "white" }} />
                                    <ListItemText primary={this.language["home-add-another-wallet"]} />
                                </ListItem>
                            </Collapse>
                        </div>
                    }
                    <Divider style={{ margin: "20px 0px" }} />
                    <ListItem button disabled={this.state.openOnboarding} component={({ innerRef, ...props }) => <Link to="/contacts" {...props} onClick={() => this.handleDialog(true)} />}>
                        <ContactsIcon style={{ color: this.props.paletteType === "light" ? "#616161" : "white" }} />
                        <ListItemText primary={this.language["contacts-list"]} />
                    </ListItem>
                    <Divider style={{ margin: "20px 0px" }} />
                    {this.props.paletteType === "light" ?
                        <ListItem button disabled={this.state.openOnboarding} onClick={this.props.setPaletteType}>
                            <DarkOnIcon style={{ color: "#616161" }} />
                            <ListItemText primary={this.language["btn-dark-on"]} />
                        </ListItem> :
                        <ListItem button disabled={this.state.openOnboarding} onClick={this.props.setPaletteType}>
                            <DarkOffIcon style={{ color: "white" }}/>
                            <ListItemText primary={this.language["btn-dark-off"]} />
                        </ListItem>
                    }
                    <ListItem button disabled={this.state.openOnboarding} component={({ innerRef, ...props }) => <Link to="/settings" {...props} onClick={() => this.handleDialog(true)} />}>
                        <SettingsIcon style={{ color: this.props.paletteType === "light" ? "#616161" : "white" }}/>
                        <ListItemText primary={this.language["settings-title"]} />
                    </ListItem>
                    <ListItem>
                        <Hidden xsDown implementation="js">
                            <LanguageIcon style={{ color: this.props.paletteType === "light" ? "#616161" : "white" }}/>
                            <ListItemText>
                                <TextField
                                    select
                                    id="language_select"
                                    type="text"
                                    value={this.languageSelect}
                                    onChange={this.setLanguage.bind(this)}
                                    InputProps={{ disableUnderline: true }}
                                >
                                    <MenuItem key="en" value="en">{this.language["lang-en"]}</MenuItem>
                                    <MenuItem key="ko" value="ko">{this.language["lang-ko"]}</MenuItem>
                                </TextField>
                            </ListItemText>
                        </Hidden>
                    </ListItem>
                </List>
            </Grid>
        )
    }

    public render() {
        window.onresize = () => {
            temporaryDrawerWidth = window.innerWidth * 0.8
            this.toggleMenu(false)
        }

        return (
            (this.state.fingerprintAuth || storage.getItem("fingerprint") === "false") || storage.getItem("fingerprint") === null ?
                <div style={{ backgroundColor: this.props.paletteType === "light" ? "white" : "#303030", display: "flex", flexDirection: "column", flexGrow: 1, paddingTop: "env(safe-area-inset-top)" }}>
                    <CssBaseline />
                    <AppBar position="absolute" elevation={0} className={this.props.classes.appBar}>
                        <Toolbar style={{ display: "flex", justifyContent: "space-between", paddingLeft: 8 }}>
                            <Hidden smUp implementation="js">
                                {this.state.openOnboarding ?
                                    <div style={{ width: 48, height: 48 }} /> :
                                    <IconButton aria-label="open menu" className={this.props.classes.menuButton} onClick={this.toggleMenu(true)}>
                                        <MenuIcon />
                                    </IconButton>
                                }
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ paddingRight: this.props.theme.spacing.unit }}>
                                        <img style={{ maxHeight: 28 }} src={this.props.paletteType === "light" ? logoColor : logoWhite} />
                                    </span>
                                </div>
                                <TextField
                                    select
                                    id="language_select"
                                    type="text"
                                    value={this.languageSelect}
                                    onChange={this.setLanguage}
                                >
                                    <MenuItem key="en" value="en">{this.language["lang-en"]}</MenuItem>
                                    <MenuItem key="ko" value="ko">{this.language["lang-ko"]}</MenuItem>
                                </TextField>
                            </Hidden>
                        </Toolbar>
                    </AppBar>
                    <nav className={this.props.classes.drawer}>
                        <Hidden smUp implementation="js">
                            <SwipeableDrawer
                                disableBackdropTransition={!iOS}
                                disableDiscovery={iOS}
                                onClose={this.toggleMenu(false)}
                                onOpen={this.toggleMenu(true)}
                                open={this.state.openMenu}
                                variant="temporary"
                                PaperProps={{ style: { width: temporaryDrawerWidth } }}
                                ModalProps={{
                                    keepMounted: true,
                                }}
                            >
                                {this.renderWallets()}
                            </SwipeableDrawer>
                        </Hidden>
                        <Hidden xsDown implementation="js">
                            <Drawer
                                classes={{
                                    paper: this.props.classes.permanentDrawerPaper,
                                }}
                                variant="permanent"
                                open
                            >
                                {this.renderWallets()}
                            </Drawer>
                        </Hidden>
                    </nav>
                    <main className={this.props.classes.content}>
                        {this.state.openOnboarding ?
                            <Onboarding
                                rest={this.props.rest}
                                language={this.language}
                                closeOnboarding={this.closeOnboarding.bind(this)}
                                setWallets={this.setWallets.bind(this)}
                                handleWalletSelect={this.handleWalletSelect.bind(this)} /> :
                            <WalletView
                                rest={this.state.rest}
                                language={this.language}
                                wallet={this.state.wallet}
                                price={this.price}
                                name={this.state.name}
                                oneHanded={this.state.oneHanded}
                                paletteType={this.props.paletteType}
                                handleDialog={this.handleDialog.bind(this)}
                                setWallets={this.setWallets.bind(this)}
                                showBalance={this.state.showBalance}
                                handleWalletSelect={this.handleWalletSelect.bind(this)}
                                updateSelected={this.updateSelected.bind(this)}
                            />
                        }

                        <Dialog id="content-dialog" fullScreen style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom", marginLeft: window.matchMedia("(max-width: 600px)").matches ? 0 : permanentDrawerWidth }} open={this.state.openDialog} onClose={() => this.handleDialog(false)} scroll={"paper"}>
                            <Switch>
                                <Route exact path="/addwallet" component={() => <AddWallet rest={this.state.rest} language={this.language} oneHanded={this.state.oneHanded} handleDialog={this.handleDialog.bind(this)} setWallets={this.setWallets.bind(this)} handleWalletSelect={this.handleWalletSelect.bind(this)} />} />
                                <Route exact path="/sendcoins" component={() => <SendHyc rest={this.state.rest} language={this.language} wallet={this.state.wallet} oneHanded={this.state.oneHanded} handleDialog={this.handleDialog.bind(this)} />} />
                                <Route exact path="/contacts" component={() => <Contacts rest={this.state.rest} language={this.language} oneHanded={this.state.oneHanded} handleDialog={this.handleDialog.bind(this)} />} />
                                <Route exact path="/giftcard" component={() => <Giftcard rest={this.state.rest} language={this.language} wallet={this.state.wallet} oneHanded={this.state.oneHanded} handleDialog={this.handleDialog.bind(this)} />} />
                                <Route exact path="/settings" component={() => <Settings language={this.language} handleDialog={this.handleDialog.bind(this)} oneHanded={this.state.oneHanded} handleOneHanded={this.handleOneHanded.bind(this)} showBalance={this.state.showBalance} showBalanceToggler={this.showBalanceToggler.bind(this)} disableFingerprintScreen={this.disableFingerprintScreen.bind(this)} />} />
                            </Switch>
                        </Dialog>
                    </main>
                </div> :
                <Grid container className={this.props.classes.root} style={{ justifyContent: "space-around" }}>
                    <Grid item xs={12}>
                        <div style={{ textAlign: "center" }}>
                            <img style={{ maxHeight: 160 }} src={lock} />
                            <Typography variant="h6" align="center" style={{ marginTop: 10, fontWeight: 600, color: "white" }}>Fingerprint on launch enabled</Typography>
                            <Typography variant="caption" align="center" style={{ color: "white" }}>Please relaunch the app to attempt authentication</Typography>
                        </div>
                    </Grid>
                </Grid>
        )
    }

    private disableFingerprintScreen = () => {
        this.setState({ fingerprintAuth: true })
    }

    private showBalanceToggler = () => {
        this.setState({ showBalance: !this.state.showBalance })
        storage.setItem("showBalance", (!this.state.showBalance).toString())
    }

    private handleOneHanded = () => {
        const tmp = !this.state.oneHanded
        this.setState({ oneHanded: tmp })
        storage.setItem("oneHanded", tmp.toString())
    }

    private closeOnboarding = () => {
        this.setState({ openOnboarding: false })
        this.forceUpdate()
    }

    private handleDialog = (open: boolean) => {
        this.setState({ openDialog: open })
        if (this.state.openDialog) {
            this.setState({ openWalletList: false, openMenu: false })
        }
    }

    private handleWalletSelect = (name: string) => () => {
        const idx = this.state.wallets.findIndex((wallet) => wallet.name === name)
        if (idx === -1) {
            if (this.state.wallets.length === 0) {
                this.setState({ name: "", wallet: { name: "", passphrase: "", password: "", hint: "", mnemonic: "", address: "", balance: "0", txs: [], pendings: [], language: "", pendingAmount: "0" }})
            } else {
                this.setState({ name: this.state.wallets[0].name })
            }
            this.setState({ selectedWalletIndex: 0, openWalletList: false, openMenu: false })
            storage.setItem("selectedWalletIndex", "0")
        } else {
            this.setState({ selectedWalletIndex: idx, name: this.state.wallets[idx].name, openWalletList: false, openMenu: false })
            storage.setItem("selectedWalletIndex", idx.toString())
        }
        this.updateSelected(name)
    }

    private toggleWalletList = (open: boolean) => () => {
        this.setWallets()
        this.setState({ openWalletList: open })
    }

    private toggleMenu = (open: boolean) => () => {
        this.setState({ openMenu: open })
    }

    private updateSelected = (name: string) => {
        this.props.rest.getWalletDetail(this.state.name).then((data: IHyconWallet & IResponseError) => {
            if (data.address) {
                this.setState({ wallet: data })
            } else {
                this.handleWalletSelect(this.state.name)
            }
        })
    }

    private setLanguage = (event: any) => {
        this.language = getMobileLocale(event.target.value)
        this.props.changeLanguage(event.target.value)
        this.props.rest.getPrice(this.language.currency).then((price: number) => {
            this.price.fiat = price
        })
    }

    private setWallets = (fromDelete?: boolean) => {
        if (fromDelete) {
            this.setState({ selectedWalletIndex: this.state.selectedWalletIndex - 1 === -1 ? 0 : this.state.selectedWalletIndex - 1 })
        }
        this.props.rest.getWalletList().then((data: any) => {
            if (data.walletList.length === 0) {
                this.setState({
                    name: "",
                    selectedWalletIndex: 0,
                    wallet: { name: "", passphrase: "", password: "", hint: "", mnemonic: "", address: "", balance: "0", txs: [], pendings: [], language: "", pendingAmount: "0" },
                    wallets: [],
                })
            } else {
                this.setState({ name: data.walletList[this.state.selectedWalletIndex].name, wallets: data.walletList })
            }
        })
    }
}

export default withStyles(styles)(MobileApp)
