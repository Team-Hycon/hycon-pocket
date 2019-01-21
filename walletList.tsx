import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import MenuItem from "@material-ui/core/MenuItem"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import AddressBookIcon from "@material-ui/icons/Contacts"
import DarkOnIcon from "@material-ui/icons/InvertColors"
import DarkOffIcon from "@material-ui/icons/InvertColorsOff"
import SettingsIcon from "@material-ui/icons/Settings"
import * as React from "react"
import { Link } from "react-router-dom"
import { IRest } from "../rest"
import Onboarding from "./content/onboarding"
import { IText } from "./locales/m_locales"

// tslint:disable:no-var-requires
// const logo = require("./img/logo.png")
const storage = window.localStorage
// tslint:disable:object-literal-sort-keys
const styles = (theme: Theme) => createStyles({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
    },
    subheader: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
    },
})

interface IProps extends WithStyles<typeof styles> {
    rest: IRest
    language: IText
    languageSelect: string
    languageChange: (code: string) => void
    setPaletteType: () => void
}

class WalletList extends React.Component<IProps, any> {

    public mounted: boolean = false
    public buttonPressTimer: any

    constructor(props: IProps) {
        super(props)




        this.state = {
            rest: this.props.rest,
            language: this.props.language,
            languageSelect: this.props.languageSelect,
            wallets: [],
            contactName: "",
            contactAddress: "",
            contactList: [],
            dialogAddContact: false,
            openOnboarding: storage.getItem("onboarding") === null ? true : false,
            activeStep: 0,
            secureOnDevice: false,
            recoverWithPhrase: false,
            termsOfUse: false,
            openDialog: false,
            scroll: "paper",
        }
        this.state.rest.getFavoriteList().then((data: any) => {
            this.setState({ contactList: data })
        })


    }

    public componentDidMount() {
        this.mounted = true
        this.setWallets()
    }

    public renderOnboarding() {
        return (<Onboarding rest={this.props.rest} language={this.props.language} closeOnboarding={this.closeOnboarding.bind(this)} />)
    }

    public renderList() {
        return (
            <Grid item xs={12} className={this.props.classes.root}>
                <Grid item xs={12}>
                    <List subheader={
                        <ListSubheader disableSticky component="div" className={this.props.classes.subheader}>
                            <span style={{ margin: "auto 0" }}>{this.props.language["wallet-list"]} ({this.state.wallets.length})</span>
                            <div>
                                <span><Link to="/addwallet"><IconButton aria-label="add-wallet"><AddIcon style={{ fontSize: 20 }} /></IconButton></Link></span>
                                <span><Link to="/contacts"><IconButton aria-label="contacts"><AddressBookIcon style={{ fontSize: 18 }} /></IconButton></Link></span>
                                <span><Link to="/settings"><IconButton aria-label="settings"><SettingsIcon style={{ fontSize: 20 }} /></IconButton></Link></span>
                            </div>
                        </ListSubheader>
                    }>
                        {this.state.wallets.map((n: { name: string, address: string }) => (
                            <Link style={{ textDecoration: "none" }} to={"/wallet/" + n.name} >
                                <ListItem
                                    key={`item-${n}`}
                                    onTouchStart={this.handleButtonPress.bind(this, n.address)}
                                    onTouchEnd={this.handleButtonRelease.bind(this)}
                                    onMouseDown={this.handleButtonPress.bind(this, n.address)}
                                    onMouseUp={this.handleButtonRelease.bind(this)}
                                >
                                    <ListItemText primary={n.name} secondary={n.address} />
                                </ListItem>
                                <Divider />
                            </Link>
                        ))}
                    </List>
                </Grid>
                {
                    this.state.wallets.length === 0 ?
                        <Grid container direction="column" justify="space-around" style={{ flexGrow: 1 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center">
                                    {this.props.language["home-guide-add-wallet"]}
                                </Typography>
                                <Typography variant="caption" align="center" style={{ paddingBottom: "10%" }}>
                                    {this.props.language["home-guide-tap-plus"]}
                                </Typography>
                            </Grid>
                        </Grid> : ""
                }
            </Grid>
        )
    }

    public render() {
        return (
            <Grid container className={this.props.classes.root}>
                {/* <Grid item xs={12}>
                    <AppBar position="static" style={{ backgroundColor: "#172349" }}>
                        <Toolbar className={this.props.classes.header}>
                            <img style={{ maxHeight: 28 }} src={logo} />
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {this.state.openOnboarding === false ? <span>
                                    <IconButton onClick={this.props.setPaletteType} style={{ color: "white" }}>
                                        {storage.getItem("paletteType") === "light" ? <DarkOnIcon /> : <DarkOffIcon />}
                                    </IconButton>
                                </span> : ""}
                                <span>
                                    <TextField
                                        select
                                        id="language_select"
                                        type="text"
                                        value={this.state.languageSelect}
                                        onChange={this.handleLangChange("languageSelect")}
                                        SelectProps={{ style: { color: "#fff" } }}
                                        style={{ color: "#fff", paddingLeft: 5 }}
                                    >
                                        <MenuItem key="en" value="en">{this.props.language["lang-en"]}</MenuItem>
                                        <MenuItem key="ko" value="ko">{this.props.language["lang-ko"]}</MenuItem>
                                    </TextField>
                                </span>
                            </div>
                        </Toolbar> */}

                        {/* Below is only used for alpha / beta test deployments. */}
                        {/* <Grid item xs={12} style={{ padding: 5, backgroundColor: "red" }}>
                            <Typography variant="caption" align="center" style={{ color: "white" }}>
                                {this.state.language["warning-do-not-share"]}
                            </Typography>
                        </Grid> */}

                    {/* </AppBar>
                </Grid> */}

                {/* Onboarding Slides or Wallet List */}
                {this.state.openOnboarding === true ? this.renderOnboarding() : this.renderList()}

                <Dialog
                    aria-labelledby="contact-add"
                    open={this.state.dialogAddContact}
                    onClose={this.closeAddContact.bind(this)}
                >
                    <div style={{ margin: "7px", textAlign: "center" }}>
                        <Typography style={{ fontSize: 10, margin: "5px" }}>
                            {this.props.language["send-hyc-add-contact-hint"]}
                        </Typography>
                        <Input
                            fullWidth
                            id="contact-name"
                            placeholder={this.props.language["ph-contact-name"]}
                            value={this.state.contactName}
                            onChange={this.handleInputChange("contactName")}
                        />
                        <Input
                            disabled
                            fullWidth
                            id="contact-address"
                            value={this.state.contactAddress}
                            inputProps={{ style: { fontSize: "12px" } }}
                        />
                        <Button
                            onClick={this.addContact.bind(this)}
                            style={{ backgroundColor: "#172349", color: "#fff", width: "100%", marginTop: "20px" }}>
                            {this.props.language["btn-add"]}
                        </Button>
                    </div>
                </Dialog>
            </Grid>
        )
    }

    private closeOnboarding() {
        this.setState({ openOnboarding: false })
        this.forceUpdate()
    }

    private handleLangChange = (prop: any) => (event: any) => {
        this.props.languageChange(event.target.value)
    }

    private handleInputChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
    }

    private setWallets() {
        this.state.rest.getWalletList().then((data: any) => {
            this.setState({ wallets: data.walletList })
        })
    }

    private handleButtonPress(addressToAdd: string) {
        this.buttonPressTimer = setTimeout(() => {
            if (confirm(this.props.language["confirm-add-address-to-contact"])) {
                this.setState({ contactAddress: addressToAdd, dialogAddContact: true })
            }
        }, 300)
    }

    private handleButtonRelease() {
        clearTimeout(this.buttonPressTimer)
    }

    private closeAddContact() {
        this.setState({ contactAddress: "", contactName: "", dialogAddContact: false })
    }

    private addContact() {
        if (!this.state.contactName) {
            alert(this.props.language["alert-enter-name"]); return
        } else if (this.checkDuplicateContact({ alias: this.state.contactName, address: this.state.contactAddress })) {
            alert(this.props.language["alert-contact-address-duplicate"])
            this.setState({ contactAddress: "", contactName: "", dialogAddContact: false })
        }

        this.state.rest.addFavorite(this.state.contactName, this.state.contactAddress).then(() => {
            this.setState({ contactAddress: "", contactName: "", dialogAddContact: false })
        })
    }

    private checkDuplicateContact(contactToInspect: { alias: string, address: string }): boolean {
        let duplicated = false
        this.state.contactList.forEach((contact: { alias: string, address: string }) => {
            if (contact.alias === contactToInspect.alias || contact.address === contactToInspect.address) {
                duplicated = true
            }
        })
        return duplicated
    }
}

export default withStyles(styles)(WalletList)
