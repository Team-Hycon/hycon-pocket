import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import Fade from "@material-ui/core/Fade"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Snackbar from "@material-ui/core/Snackbar"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance"
import CloseIcon from "@material-ui/icons/Close"
import DeleteIcon from "@material-ui/icons/Delete"
import CopyIcon from "@material-ui/icons/FileCopy"
import * as React from "react"
import * as CopyToClipboard from "react-copy-to-clipboard"
import { Link } from "react-router-dom"
import { IHyconWallet, IRest } from "../rest"
import ColorButton from "./component/ColorButton"
import NavBar from "./component/NavBar"
import { IText } from "./locales/m_locales"

const patternAddress = /^H[A-Za-z0-9+]{20,}$/
// tslint:disable-next-line:no-var-requires
const addressBook = require("./img/address-book.png")

const styles = (theme: Theme) => createStyles({
    header: {
        display: "flex",
        justifyContent: "space-between",
        minHeight: 48,
        padding: 0,
    },
    icon: {
        height: 48,
        width: 48,
    },
    root: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
})

interface IProps extends WithStyles<typeof styles> {
    handleDialog: (open: boolean) => void
    language: IText
    oneHanded: boolean
    rest: IRest
}

interface IState {
    wallets: IHyconWallet[]
}

class Contacts extends React.Component<IProps, any> {
    public buttonPressTimer: any

    constructor(props: IProps) {
        super(props)
        this.state = {
            checked: [1],
            contactAddress: "",
            contacts: [],
            dialogAddContact: false,
            isRemoving: false,
            isScanning: false,
            qrScannerReady: false,
            rest: this.props.rest,
            wallets: [],
        }
        window.QRScanner.prepare((err, status) => {
            if (err) { console.error(err); return }
            if (status.authorized) {
                window.QRScanner.cancelScan()
                window.QRScanner.destroy()
                this.setState({ qrScannerReady: true })
            }
        })
        this.getContacts()
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public componentDidMount() {
        document.addEventListener("backbutton", (event) => {
            event.preventDefault()
            if (this.state.dialogAddContact || this.state.isScanning) {
                this.setState({ dialogAddContact: false, isScanning: false })
                window.location.hash = "#/contacts"
            } else {
                this.props.handleDialog(false)
                window.location.hash = "#/"
            }
            return
        }, false)
    }

    public componentWillUnmount() {
        document.removeEventListener("backbutton", (event) => {
            event.preventDefault()
            if (this.state.dialogAddContact || this.state.isScanning) {
                this.setState({ dialogAddContact: false, isScanning: false })
                window.location.hash = "#/contacts"
            } else {
                this.props.handleDialog(false)
                window.location.hash = "#/"
            }
            return
        }, false)
    }

    public renderListContacts() {
        return (
            <List
                style={{ display: "flex", flexDirection: "column", flexGrow: this.state.contacts.length === 0 ? 1 : 0 }}
                subheader={
                    <ListSubheader disableSticky component="div" className={this.props.classes.header}>
                        <span style={{ margin: "auto 0 auto 12px" }}>{this.props.language["contacts-list"]} ({this.state.contacts !== null ? this.state.contacts.length : 0})</span>
                        <div>
                            <span><IconButton aria-label="Add" onClick={this.openAddContact.bind(this)}><AddIcon/></IconButton></span>
                        </div>
                    </ListSubheader>
                }>
                {this.state.contacts.length === 0 ?
                    <Grid container style={{ flexDirection: "column", flexGrow: 1, justifyContent: "space-around" }}>
                        <div style={{ textAlign: "center" }}>
                            <img style={{ maxHeight: 160 }} src={addressBook} />
                            <Typography variant="h6" align="center" style={{ marginTop: 10, fontWeight: 600 }}>{this.props.language["contacts-empty"]}</Typography>
                            <Typography variant="caption" align="center">{this.props.language["contacts-action"]}</Typography>
                        </div>
                    </Grid> :
                    this.state.contacts.map((value: any) => (
                        <Grid item xs={12}>
                            <ListItem
                                button
                                key={value.address}
                                onTouchStart={this.handleButtonPress.bind(this)}
                                onTouchEnd={this.handleButtonRelease.bind(this)}
                                onMouseDown={this.handleButtonPress.bind(this)}
                                onMouseUp={this.handleButtonRelease.bind(this)}
                            >
                                <ListItemText primary={value.alias} secondary={value.address} />
                                <ListItemSecondaryAction>
                                    {!this.state.isRemoving ?
                                        <CopyToClipboard text={value.address}>
                                            <IconButton onClick={this.handleClick}><CopyIcon/></IconButton>
                                        </CopyToClipboard>
                                        : <Checkbox onChange={this.handleToggle(value)} checked={this.state.checked.indexOf(value) !== -1} />
                                    }
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </Grid>
                    ))
                }

                <Dialog
                    aria-labelledby="contact-add"
                    open={this.state.dialogAddContact}
                    onClose={this.closeAddContact.bind(this)}
                >
                    <DialogTitle id="alert-dialog-title">{this.props.language["send-hyc-add-contact-hint"]}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            id="contact-name"
                            value={this.state.contactName}
                            onChange={this.handleChange("contactName")}
                            placeholder={this.props.language["ph-contact-name"]}
                            style={{ marginBottom: 10 }}
                        />
                        <TextField
                            fullWidth
                            id="contact-address"
                            value={this.state.contactAddress}
                            onChange={this.handleChange("contactAddress")}
                            placeholder={this.props.language["ph-wallet-address"]}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="Qr" disabled={!this.state.qrScannerReady} onClick={() => this.openQrScanner()}><CameraEnhanceIcon style={{ fontSize: 18 }} /></IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeAddContact.bind(this)}>
                            {this.props.language["btn-cancel"]}
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            style={{ backgroundColor: "#172349", color: "white" }}
                            onClick={this.addContact.bind(this)}
                        >
                            {this.props.language["btn-add"]}
                        </Button>
                    </DialogActions>
                </Dialog>
            </List>
        )
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <NavBar
                    handleDialog={this.props.handleDialog}
                    oneHanded={this.props.oneHanded}
                    rightElement={this.state.isRemoving
                        ? <IconButton className={this.props.classes.icon} onClick={this.deleteContacts.bind(this)}>{this.state.checked.length === 1 ? <CloseIcon /> : <DeleteIcon />}</IconButton>
                        : <div className={this.props.classes.icon} />
                    }
                    title={this.props.language["contacts-title"]}
                />
                {this.state.isScanning ?
                    <AppBar id="qrCloseButton" style={{ background: "transparent", boxShadow: "none", top: 12 }} position="absolute">
                        <Toolbar style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="fab"
                                aria-label="Close Scanner"
                                onClick={this.closeScan.bind(this)}
                                style={{ backgroundColor: "#424242", color: "#fff" }}>
                                <CloseIcon />
                            </Button>
                        </Toolbar>
                    </AppBar> :
                    this.renderListContacts()
                }

                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={this.state.copied}
                    onClose={this.handleClose}
                    TransitionComponent={Fade}
                    ContentProps={{ "aria-describedby": "message-id" }}
                    message={<span id="message-id">{this.props.language["help-copied"]}!</span>}
                />
            </div>
        )
    }

    public handleClick = () => {
        this.setState({ copied: true })
    }

    public handleClose = () => {
        this.setState({ copied: false })
    }
    private getContacts() {
        this.state.rest.getFavoriteList().then((data: any) => {
            this.setState({ contacts: data })
        })
    }
    private handleButtonPress() {
        this.buttonPressTimer = setTimeout(() => {
            this.setState({ isRemoving: true })
            navigator.vibrate(500)
        }, 1200)
    }

    private handleButtonRelease() {
        clearTimeout(this.buttonPressTimer)
    }

    private deleteContacts() {
        if (this.state.checked.length > 1) {
            this.state.rest.deleteFavoriteTab(this.state.checked).then((res: any) => {
                this.state.rest.getFavoriteList().then((data: any) => {
                    this.setState({ contacts: data, isRemoving: false, checked: [1] })
                })
            })
        }
        this.setState({ isRemoving: false })
    }

    private handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
    }

    private handleToggle = (value: any) => () => {
        const { checked } = this.state
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        this.setState({
            checked: newChecked,
        })

    }

    private openAddContact() {
        this.setState({ dialogAddContact: true })
    }

    private closeAddContact() {
        this.setState({ contactAddress: "", contactName: "", dialogAddContact: false })
    }
    private addContact() {
        if (!this.state.contactName) {
            alert(this.props.language["alert-enter-name"]); return
        } else if (!this.state.contactAddress) {
            alert(this.props.language["alert-enter-address"]); return
        } else if (this.state.contactAddress && !patternAddress.test(this.state.contactAddress)) {
            alert(this.props.language["alert-invalid-address"]); return
        } else if (this.checkDuplicateContact({ alias: this.state.contactName, address: this.state.contactAddress })) {
            alert(this.props.language["alert-contact-address-duplicate"]); return
        }

        this.state.rest.addFavorite(this.state.contactName, this.state.contactAddress).then(() => {
            this.state.rest.getFavoriteList().then((data: any) => {
                this.setState({ contactAddress: "", contactName: "", contacts: data, dialogAddContact: false, dialogContacts: true })
            })
        })
    }

    private checkDuplicateContact(contactToInspect: { alias: string, address: string }): boolean {
        let duplicated = false
        this.state.contacts.forEach((contact: { alias: string, address: string }) => {
            if (contact.alias === contactToInspect.alias || contact.address === contactToInspect.address) {
                duplicated = true
            }
        })
        return duplicated
    }

    private openQrScanner() {
        this.setState({ isScanning: true })
        document.getElementById("body").style.visibility = "hidden"
        document.getElementById("blockexplorer").style.visibility = "hidden"
        window.QRScanner.scan((err, text) => {
            if (err) {
                console.error(err)
            }
            document.getElementById("body").style.visibility = "visible"
            document.getElementById("blockexplorer").style.visibility = "visible"

            if (text.charAt(0) === "H") {
                this.setState({ contactAddress: text })
            } else {
                this.setState({ contactAddress: JSON.parse(text).address })
            }

            window.QRScanner.destroy()
            this.setState({ isScanning: false })
        })
        window.QRScanner.show(((status) => {
            document.getElementById("qrCloseButton").style.visibility = "visible"
        }))
    }

    private closeScan() {
        window.QRScanner.destroy()
        this.setState({ isScanning: false })
        document.getElementById("qrCloseButton").style.visibility = "hidden"
        document.getElementById("body").style.visibility = "visible"
        document.getElementById("blockexplorer").style.visibility = "visible"
    }
}

export default withStyles(styles)(Contacts)
