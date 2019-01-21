import AppBar from "@material-ui/core/AppBar"
import Avatar from "@material-ui/core/Avatar"
import Collapse from "@material-ui/core/Collapse"
import CssBaseline from "@material-ui/core/CssBaseline"
import Dialog from "@material-ui/core/Dialog"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import LinearProgress from "@material-ui/core/LinearProgress"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import MenuItem from "@material-ui/core/MenuItem"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import createStyles from "@material-ui/core/styles/createStyles"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
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
import { Contacts } from "./contacts"
import { Giftcard } from "./giftcard"
import { getMobileLocale, IText } from "./locales/m_locales"
import SendHyc from "./sendHyc"
import Settings from "./settings"
import WalletList from "./walletList"
import WalletView from "./walletView"

declare var navigator: any
declare var window: any
// tslint:disable:no-var-requires
const logoWhite = require("./img/logo-w.png")
const logoColor = require("./img/logo-c.png")
const permanentDrawerWidth = 300
let temporaryDrawerWidth = window.innerWidth * 0.8
const storage = window.localStorage

const styles = (theme: Theme) => createStyles({
    appBar: {
        backgroundColor: "transparent",
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
toolbar: theme.mixins.toolbar,
})

interface IProps extends WithStyles<typeof styles> {
    rest: IRest
}
interface IState {
    name?: string
    openMenu: boolean
    openWalletList: boolean
    paletteType: string
    selectedWalletIndex: number
    selectedWalletName: string
    redirect: boolean
    wallet: IHyconWallet
    wallets: IHyconWallet[]
    openDialog: boolean
    confirmAppExit: boolean
}

export interface IPrice {
    fiat: any,
    eth: any,
    btc: any,
}

class MobileApp extends React.Component<IProps, IState & IProps> {

    public mounted = false
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
            name: "",
            openDialog: false,
            openMenu: false,
            openWalletList: false,
            paletteType: storage.getItem("paletteType") === null ? "light" : storage.getItem("paletteType"),
            redirect: false,
            rest: this.props.rest,
            selectedWalletIndex: storage.getItem("selectedWalletIndex") === null ? 0 : Number(storage.getItem("selectedWalletIndex")),
            selectedWalletName: "",
            wallet: { name: "", passphrase: "", password: "", hint: "", mnemonic: "", address: "", balance: "0", txs: [], pendings: [], language: "", pendingAmount: "0" },
            wallets: [],
        }
    }

    public componentDidMount() {
        document.addEventListener("backbutton", (event) => {
            event.preventDefault()
            console.log("mobileClient backbutton trigger")
            console.log(this.state.confirmAppExit)
            if (window.location.hash === "#/") {
                console.log(this.state.confirmAppExit)
                { this.state.confirmAppExit ? navigator.app.exitApp() : this.setState({ confirmAppExit: true }) }
                window.plugins.toast.showShortBottom("Press back again to exit")
            }
            window.setTimeout(() => { this.setState({ confirmAppExit: false }); console.log("timeout: " + this.state.confirmAppExit)}, 1000)
            return
        }, false)

        this.props.rest.getWalletList().then((data: any) => {
            if (data.walletList.length !== 0) {
                const walletName = data.walletList[this.state.selectedWalletIndex].name

                this.setState({
                    name: walletName,
                    wallets: data.walletList,
                })

                this.props.rest.getWalletDetail(walletName).then((wallet: IHyconWallet & IResponseError) => {
                    if (wallet.address) {
                        this.setState({ wallet })
                    } else {
                        // if wallet not found, select a new wallet
                        this.handleWalletSelect(walletName)
                    }
                })
            }
        })
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
    public renderWallets() {
        // console.log("rednerWallets")
        // console.log(this.state.wallets)
        // console.log(this.state.selectedWalletIndex)
        // console.log(this.state.selectedWalletName)
        return (
            <div>
                <Hidden xsDown implementation="js">
                    <div className={this.props.classes.toolbar} />
                </Hidden>
                <List>
                    {this.state.wallets.length === 0 ?
                        <ListItem button component={({ innerRef, ...props }) => <li><Link to="/addwallet" {...props} style={{ float: "none" }} onClick={this.handleDialog} /></li>}>
                            <Avatar className={this.props.classes.avatar}><AddIcon /></Avatar>
                            <ListItemText primary={"Add a wallet"} />
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
                                    // onTouchStart={this.handleButtonPress.bind(this, n.address)}
                                    // onTouchEnd={this.handleButtonRelease.bind(this)}
                                    // onMouseDown={this.handleButtonPress.bind(this, n.address)}
                                    // onMouseUp={this.handleButtonRelease.bind(this)}
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
                                <ListItem button component={({ innerRef, ...props }) => <Link to="/addwallet" {...props} onClick={this.handleDialog} />} style={{ paddingTop: 20 }}>
                                    <AddIcon className={this.props.classes.avatarSmall} style={{ color: this.state.paletteType === "light" ? "#616161" : "white" }} />
                                    <ListItemText primary="Add another wallet" />
                                </ListItem>
                            </Collapse>
                        </div>
                    }
                    <Divider style={{ margin: "20px 0px" }} />
                    <ListItem button component={({ innerRef, ...props }) => <Link to="/contacts" {...props} onClick={this.handleDialog} />}>
                        <ContactsIcon style={{ color: this.state.paletteType === "light" ? "#616161" : "white" }} />
                        <ListItemText primary="Contacts" />
                    </ListItem>
                    <Divider style={{ margin: "20px 0px" }} />
                    {this.state.paletteType === "light" ?
                        <ListItem button onClick={this.setPaletteType.bind(this)}>
                            <DarkOnIcon style={{ color: "#616161" }} />
                            <ListItemText primary="Turn dark theme on" />
                        </ListItem> :
                        <ListItem button onClick={this.setPaletteType.bind(this)}>
                            <DarkOffIcon style={{ color: "white" }}/>
                            <ListItemText primary="Turn dark theme off" />
                        </ListItem>
                    }
                    <ListItem button component={({ innerRef, ...props }) => <Link to="/settings" {...props} onClick={this.handleDialog} />}>
                        <SettingsIcon style={{ color: this.state.paletteType === "light" ? "#616161" : "white" }}/>
                        <ListItemText primary="Settings" />
                    </ListItem>
                    <ListItem>
                        <Hidden xsDown implementation="js">
                            <LanguageIcon style={{ color: this.state.paletteType === "light" ? "#616161" : "white" }}/>
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
            </div>
        )
    }

    public render() {
        const typography = {
            fontFamily: this.languageSelect === "en" ?
                ["Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(",") :
                ["Nanum Gothic", "Source Sans Pro", "Helvetica", "-apple-system", "sans-serif"].join(","),
            fontWeightLight: 400,
            fontWeightMedium: 400,
            fontWeightRegular: this.languageSelect === "en" ? 600 : 700,
            useNextVariants: true,
        }

        const theme = createMuiTheme({ palette: { type: this.state.paletteType === "light" ? "light" : "dark" }, typography })

        window.onresize = () => {
            temporaryDrawerWidth = window.innerWidth * 0.8
            this.toggleMenu(false)
        }

        if (this.state.wallet === null) {
            return <div>Loading</div>
        }

        console.log(window.location)

        return (
            <MuiThemeProvider theme={theme}>
                <div style={{ backgroundColor: this.state.paletteType === "light" ? "white" : "#303030", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <CssBaseline />
                    <AppBar position="absolute" elevation={0} className={this.props.classes.appBar}>
                        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                            <IconButton aria-label="open menu" className={this.props.classes.menuButton} onClick={this.toggleMenu(true)}>
                                <MenuIcon />
                            </IconButton>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ paddingRight: theme.spacing.unit }}>
                                    <img style={{ maxHeight: window.matchMedia("(max-width: 600px)").matches ? 28 : 38 }} src={this.state.paletteType === "light" ? logoColor : logoWhite} />
                                </span>
                                <span><Typography variant="h5" style={{ fontWeight: 400, paddingBottom: "3%", fontFamily: "Source Sans Pro" }}>Pocket</Typography></span>
                            </div>
                            <Hidden smUp implementation="js">
                                <TextField
                                    select
                                    id="language_select"
                                    type="text"
                                    value={this.languageSelect}
                                    onChange={this.setLanguage.bind(this)}
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
                                variant="temporary"
                                open={this.state.openMenu}
                                onOpen={this.toggleMenu(true)}
                                onClose={this.toggleMenu(false)}
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
                        <WalletView
                            rest={this.state.rest}
                            language={this.language}
                            wallet={this.state.wallet}
                            price={this.price}
                            name={this.state.name}
                            paletteType={this.state.paletteType}
                            handleDialog={this.handleDialog.bind(this)}
                            setWallets={this.setWallets.bind(this)}
                            handleWalletSelect={this.handleWalletSelect.bind(this)}
                            updateSelected={this.updateSelected.bind(this)}
                        />
                        <Dialog fullScreen open={this.state.openDialog} onClose={this.handleDialog} scroll={"paper"}>
                            <Switch>
                                <Route exact path="/addwallet" component={() => <AddWallet rest={this.state.rest} language={this.language} handleDialog={this.handleDialog.bind(this)} setWallets={this.setWallets.bind(this)} handleWalletSelect={this.handleWalletSelect.bind(this)} />} />
                                <Route exact path="/sendcoins" component={() => <SendHyc rest={this.state.rest} language={this.language} wallet={this.state.wallet} handleDialog={this.handleDialog.bind(this)} />} />
                                <Route exact path="/contacts" component={() => <Contacts rest={this.state.rest} language={this.language} handleDialog={this.handleDialog.bind(this)} />} />
                                <Route exact path="/giftcard" component={() => <Giftcard rest={this.state.rest} language={this.language} wallet={this.state.wallet} handleDialog={this.handleDialog.bind(this)} />} />
                                <Route exact path="/settings" component={() => <Settings language={this.language} handleDialog={this.handleDialog.bind(this)} />} />
                            </Switch>
                        </Dialog>
                    </main>
                </div>
            </MuiThemeProvider>
        )
    }

    private handleDialog = () => {
        this.setState({ openDialog: !this.state.openDialog })
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

    private setPaletteType() {
        const paletteType = this.state.paletteType === "light" ? "dark" : "light"
        this.setState({ paletteType })
        storage.setItem("paletteType", paletteType)
    }
    private updateSelected(name: string) {
        this.props.rest.getWalletDetail(this.state.name).then((data: IHyconWallet & IResponseError) => {
            console.log("updateSelected")
            console.log(data)
            if (data.address) {
                this.setState({ wallet: data })
            } else {
                // if wallet not found, select a new wallet
                this.handleWalletSelect(this.state.name)
            }
        })
    }

    private getLanguage(code: string) {
        this.language = getMobileLocale(code)
        this.languageSelect = code
        this.state.rest.getPrice(this.language.currency).then((price: number) => {
            this.price.fiat = price
        })
        this.forceUpdate()
    }

    private setLanguage(event: any) {
        this.language = getMobileLocale(event.target.value)
        this.languageSelect = event.target.value
        this.props.rest.getPrice(this.language.currency).then((price: number) => {
            this.price.fiat = price
        })
        this.forceUpdate()
    }

    private setWallets(fromDelete?: boolean) {
        if (fromDelete) {
            this.setState({ selectedWalletIndex: this.state.selectedWalletIndex - 1 === -1 ? 0 : this.state.selectedWalletIndex - 1 })
        }
        this.props.rest.getWalletList().then((data: any) => {
            console.log("setWallets getWalletList()")
            if (data.walletList.length === 0) {
                this.setState({
                    name: "",
                    selectedWalletIndex: 0,
                    wallet: { name: "", passphrase: "", password: "", hint: "", mnemonic: "", address: "", balance: "0", txs: [], pendings: [], language: "", pendingAmount: "0" },
                    wallets: [],
                })
            } else {
                console.log(data)
                this.setState({ name: data.walletList[this.state.selectedWalletIndex].name, wallets: data.walletList })
            }
        })
    }
}

export default withStyles(styles)(MobileApp)
