import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Paper from "@material-ui/core/Paper"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance"
import QRScannerIcon from "@material-ui/icons/CenterFocusWeak"
import CloseIcon from "@material-ui/icons/Close"
import AddressBookIcon from "@material-ui/icons/Contacts"
import TooltipIcon from "@material-ui/icons/Help"
import * as React from "react"
import { IRest } from "../rest"
import ColorButton from "./component/ColorButton"
import NavBar from "./component/NavBar"
import { IText } from "./locales/m_locales"

declare let window: any

// tslint:disable:no-var-requires
const Long = require("long")
const patternAddress = /^H[A-Za-z0-9+]{20,}$/
const patternHycon = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
    },
    container: {
        display: "flex",
        justifyContent: "center",
    },
    dialogPaper: {
        minHeight: 150,
    },
})

interface IProps extends WithStyles<typeof styles> {
    rest: IRest
    language: IText
    wallet: any
    oneHanded: boolean
    handleDialog: (open: boolean) => void
}

class SendHyc extends React.Component<IProps, any> {

    public static getDerivedStateFromProps(nextProps: IProps, previousState: any): any & IProps {
        return Object.assign(nextProps, {})
    }
    public mounted: boolean = false
    public storage = window.localStorage

    constructor(props: IProps) {
        super(props)
        const wallets = JSON.parse(this.storage.getItem("/wallets"))
        const globalFee = wallets[""].miningFee
        const fee = Object.keys(wallets).length === 1 ? "" : wallets[this.props.wallet.name].miningFee
        let add = ""
        let am = 0
        if (this.storage.getItem("hpay") !== "" && this.storage.getItem("hpay") != null) {
            const hpay = this.storage.getItem("hpay")
            add = hpay.split("+")[0]
            // tslint:disable-next-line:radix
            am = parseInt(hpay.split("+")[1])
        }

        this.state = {
            sendingStatus: false,
            dialogAddContact: false,
            dialogContacts: false,
            dialogStatus: false,
            totalHYC: this.props.wallet.balance,
            amountSending: am === 0 ? "" : 0,
            globalFee: globalFee === "",
            miningFee: fee === "" ? wallets[""].miningFee : fee,
            canType: (globalFee === "" && fee === "") ? true : false,
            address: "",
            fromAddress: this.props.wallet.address,
            toAddress: add,
            password: "",
            contactsList: [],
            contactName: "",
            contactAddress: "",
            qrScannerReady: false,
            isScanning: false,
            isScannedForContact: false,
            tooltipOpen: false,
            error: this.props.language["send-hyc-fail"],
            errorCode: 0,
        }

        window.QRScanner.prepare((err, status) => {
            if (err) { console.error(err); return }
            if (status.authorized) {
                window.QRScanner.cancelScan()
                window.QRScanner.destroy()
                this.setState({ qrScannerReady: true })
            }
        })
    }

    public componentDidMount() {
        this.mounted = true

        document.addEventListener("backbutton", (event) => {
            event.preventDefault()
            this.props.handleDialog(false)
            window.location.hash = "#/"
            return
        }, false)

        this.getContacts()
    }

    public componentWillUnmount() {
        document.removeEventListener("backbutton", (event) => {
            event.preventDefault()
            this.props.handleDialog(false)
            window.location.hash = "#/"
            return
        }, false)
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: any): boolean {
        return true
    }

    public render() {
        return (
            <Grid className={this.props.classes.root}>
                <NavBar
                    handleDialog={this.props.handleDialog}
                    oneHanded={this.props.oneHanded}
                    rightElement={<IconButton aria-label="Qr" disabled={!this.state.qrScannerReady} onClick={this.openQrScanner.bind(this)}><QRScannerIcon /></IconButton>}
                    title={this.props.language["send-hyc-title"]}
                />
                <Grid justify="space-between" className={this.props.classes.root}>
                    <Grid style={{ flexGrow: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                error={this.handleError("address") !== ""}
                                fullWidth
                                helperText={this.handleError("address")}
                                id="search-address"
                                margin="normal"
                                onChange={this.handleChange("toAddress")}
                                placeholder={this.props.language["ph-wallet-address"]}
                                value={this.state.toAddress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton aria-label="Open Contact List" onClick={this.openContacts.bind(this)}>
                                                <AddressBookIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid container direction="row" alignItems="center" alignContent="flex-end">
                            <Grid item xs>
                            </Grid>
                            <Grid item xs>
                                <Typography align="right" style={{ padding: "0 auto" }}>
                                    {this.props.language["send-hyc-how-it-works"]}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <ClickAwayListener onClickAway={this.handleTooltipClose}>
                                    <Tooltip
                                        disableTouchListener
                                        interactive
                                        open={this.state.tooltipOpen}
                                        onClose={this.handleTooltipClose}
                                        placement="bottom-end"
                                        title={this.props.language["send-hyc-answer-how-it-works"]}
                                        style={{ fontSize: 12 }}
                                        >
                                        <IconButton>
                                            <TooltipIcon onClick={this.handleTooltipOpen}/>
                                        </IconButton>
                                    </Tooltip>
                                </ClickAwayListener>
                            </Grid>
                        </Grid >
                        <Card elevation={0}>
                            <CardContent>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <Card elevation={1}>
                                            <CardContent>
                                                <Typography variant="h6" align="left" gutterBottom>
                                                    {this.props.language["detail-your-balance"]}
                                                </Typography>
                                                <Typography variant="h4" align="left" style={{ fontFamily: "Source Code Pro, monospace" }}>
                                                    {this.state.totalHYC} HYC
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            error={this.handleError("amount") !== ""}
                                            helperText={this.handleError("amount")}
                                            value={this.state.amountSending}
                                            type="number"
                                            label={this.props.language["ph-amount"]}
                                            placeholder="0"
                                            variant="outlined"
                                            onChange={this.handleChange("amountSending")}
                                            style={{ width: "100%" }}
                                            inputProps={{ style: { maxWidth: "100%", textAlign: "right" } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Button size="small" onClick={this.handleMaxClick.bind(this)}>
                                                            {this.props.language["btn-max"]}
                                                        </Button>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        HYC
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} onClick={this.handleFeeTooltip}>
                                        <TextField
                                            disabled={!this.state.canType}
                                            error={this.handleError("fee") !== ""}
                                            helperText={this.handleError("fee")}
                                            value={this.state.miningFee}
                                            onChange={this.handleChange("miningFee")}
                                            type="number"
                                            label={this.props.language["ph-fee"]}
                                            placeholder="0"
                                            variant="outlined"
                                            style={{ width: "100%" }}
                                            inputProps={{ style: { maxWidth: "100%", textAlign: "right" } }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        HYC
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item style={{ padding: 0 }}>
                        <Grid item xs={12} style={{ margin: "8px 20px" }}>
                            <TextField fullWidth
                                id="password"
                                value={this.state.password}
                                error={this.state.wrongPassword}
                                helperText={this.state.wrongPassword ? this.props.language["alert-invalid-password"] : null}
                                onChange={this.handleChange("password")}
                                placeholder={this.props.language["ph-wallet-password"]}
                                inputProps={{ style: { textAlign: "center" } }}
                                type="password"
                            />
                            <ColorButton fullWidth size="large" onClick={this.handleSubmit.bind(this)}>{this.props.language["btn-send"]}</ColorButton>
                        </Grid>
                    </Grid>
                </Grid>
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
                    ""
                }

                <Dialog
                    aria-labelledby="simple_dialog_title"
                    open={this.state.dialogStatus}
                // classes={{ paper: this.props.classes.dialogPaper }}
                >
                    <DialogTitle>{this.props.language["send-hyc-tx-status"]}</DialogTitle>
                    <div>
                        {
                            this.state.sendingStatus === true ?

                                <Paper style={{ padding: 10 }}>
                                    {this.storage.getItem("firstTransaction") !== "1" ? this.storeFirstTransaction() : <p></p>}
                                    <Typography gutterBottom align="center">
                                        {this.props.language["send-hyc-success"]}
                                    </Typography>
                                    {/* <Link to={"/wallet/" + this.props.wallet.name}> */}
                                        <Button
                                            style={{ backgroundColor: "#172349", color: "#fff", width: "100%", padding: "16px 24px" }}
                                            onClick={() => this.props.handleDialog(false)}>
                                            {this.props.language["btn-finish"]}
                                        </Button>
                                    {/* </Link> */}
                                </Paper>
                                :
                                <Paper style={{ padding: 10 }}>
                                    <Typography gutterBottom align="center">
                                        {this.state.error}
                                    </Typography>
                                    <Button
                                        onClick={this.closeDialog.bind(this)}
                                        style={{ backgroundColor: "#172349", color: "#fff", width: "100%", padding: "16px 24px" }}>
                                        {this.props.language["btn-close"]}
                                    </Button>
                                </Paper>
                        }
                    </div>
                </Dialog>

                <Dialog
                    scroll="paper"
                    aria-labelledby="contact-list"
                    open={this.state.dialogContacts}
                    onClose={this.closeContacts.bind(this)}
                // classes={{ paper: this.props.classes.dialogPaper }}
                >
                    <DialogContent>
                        <List
                            subheader={
                                <ListSubheader style={{ fontSize: 12 }}>
                                    {this.state.contactsList.length === 0
                                        ? this.props.language["send-hyc-add-contact"]
                                        : this.props.language["send-hyc-select-address"]}
                                </ListSubheader>
                            }
                        >
                            {this.state.contactsList.map((value: any) => (
                                <div>
                                    <ListItem button key={value.address} onClick={this.setContactandClose(value.address)}>
                                        <ListItemText
                                            primary={value.alias}
                                            secondaryTypographyProps={{ style: { fontSize: 11 } }}
                                            secondary={value.address} />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                            }
                            <Button
                                onClick={this.openAddContact.bind(this)}
                                style={{ backgroundColor: "#172349", color: "#fff", width: "100%" }}>
                                {this.props.language["btn-add"]}
                            </Button>
                        </List>
                    </DialogContent>
                </Dialog>

                <Dialog
                    aria-labelledby="contact-add"
                    open={this.state.dialogAddContact}
                    onClose={this.closeAddContact.bind(this)}
                // classes={{ paper: this.props.classes.dialogPaper }}
                >
                    <DialogTitle id="alert-contact-add">{this.props.language["send-hyc-add-contact-hint"]}</DialogTitle>
                    <DialogContent>
                        <Input
                            fullWidth
                            id="contact-name"
                            placeholder={this.props.language["ph-contact-name"]}
                            value={this.state.contactName}
                            onChange={this.handleChange("contactName")}
                        />
                        <Input
                            fullWidth
                            id="contact-address"
                            placeholder={this.props.language["ph-wallet-address"]}
                            value={this.state.contactAddress}
                            onChange={this.handleChange("contactAddress")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="Qr" disabled={!this.state.qrScannerReady} onClick={() => this.openQrScannerContact()}><CameraEnhanceIcon style={{ fontSize: 18 }} /></IconButton>
                                </InputAdornment>
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.addContact.bind(this)}
                            style={{ backgroundColor: "#172349", color: "#fff", width: "100%", marginTop: "20px" }}>
                            {this.props.language["btn-add"]}
                        </Button>
                    </DialogActions>
                </Dialog >

                <Dialog
                    aria-labelledby="password-popup"
                    open={this.state.askForPassword}
                    onClose={this.closeAskForPassword.bind(this)}
                    classes={{ paper: this.props.classes.dialogPaper }}
                >
                    <DialogTitle id="alert-dialog-title">{this.props.language["alert-enter-password"]}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            id="password"
                            type="password"
                            error={this.state.wrongPassword}
                            value={this.state.password}
                            style={{ fontSize: "1em" }}
                            onChange={this.handleChange("password")}
                            placeholder={this.props.language["ph-wallet-password"]}
                            helperText={this.state.wrongPassword ? this.props.language["alert-invalid-password"] : null}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.validPassword.bind(this)}
                            style={{ backgroundColor: "#172349", color: "#fff", width: "100%", marginTop: "20px" }}>
                            {this.props.language["btn-continue"]}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid >
        )
    }

    private handleError(label: string): string {
        if (label === "address") {
            switch (this.state.errorCode) {
                case 1:
                    return this.state.toAddress === "" ? this.props.language["alert-enter-address"] : ""
                case 7:
                    return this.props.language["alert-cannot-send-yourself"]
                case 8:
                    return this.props.language["alert-enter-address"]
                case 9:
                    return this.props.language["alert-invalid-address"]
                default:
                    return ""
            }
        } else if (label === "amount") {
            switch (this.state.errorCode) {
                case 1:
                    return this.state.amountSending === "" ? this.props.language["alert-invalid-amount"] : ""
                case 2:
                    return this.props.language["alert-invalid-amount"]
                case 3:
                    return this.props.language["alert-9decimal-amount"]
                case 5:
                    return this.props.language["alert-insufficient-balance"]
                default:
                    return ""
            }
        } else if (label === "fee") {
            switch (this.state.errorCode) {
                case 1:
                    return this.state.miningFee === "" ? this.props.language["alert-invalid-fee"] : ""
                case 4:
                    return this.props.language["alert-9decimal-fee"]
                case 6:
                    return this.props.language["alert-invalid-fee"]
                case 10:
                    return this.props.language["fee-helper-text"]
                default:
                    return ""
            }
        }
        return ""
    }
    private storeFirstTransaction() {
        this.storage.setItem("firstTransaction", "1")
        window.AppRate.promptForRating(true)
    }

    private handleFeeTooltip = () => {
        if (!this.state.canType) {
            this.setState({ errorCode: 10 })
        }
    }

    private handleTooltipClose = () => {
        this.setState({ tooltipOpen: false })
    }

    private handleTooltipOpen = () => {
        this.setState({ tooltipOpen: true })
    }

    private getContacts() {
        this.state.rest.getFavoriteList().then((data: any) => {
            this.setState({ contactsList: data })
        })
    }

    private closeDialog() {
        this.setState({ dialogStatus: false })
    }

    private openContacts() {
        this.setState({ dialogContacts: true })
    }

    private setContactandClose = (prop: any) => (event: any) => {
        this.setState({ toAddress: prop })
        this.closeContacts()
    }

    private closeContacts() {
        this.setState({ dialogContacts: false })
    }

    private validPassword() {
        this.handleSubmit()
    }

    private closeAskForPassword() {
        this.setState({ askForPassword: false })
    }

    private openAddContact() {
        this.setState({ dialogAddContact: true })
    }

    private closeAddContact() {
        this.setState({ contactAddress: "", contactName: "", dialogAddContact: false, dialogContacts: true })
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
                this.setState({ contactAddress: "", contactName: "", contactsList: data, dialogAddContact: false, dialogContacts: true })
            })
        })
    }

    private checkDuplicateContact(contactToInspect: { alias: string, address: string }): boolean {
        let duplicated = false
        this.state.contactsList.forEach((contact: { alias: string, address: string }) => {
            if (contact.alias === contactToInspect.alias || contact.address === contactToInspect.address) {
                duplicated = true
            }
        })
        return duplicated
    }

    private sendTransaction() {
        this.props.rest.sendTx({ name: this.props.wallet.name, password: this.state.password, address: this.state.toAddress, amount: this.state.amountSending, minerFee: this.state.miningFee, nonce: undefined })
            .then((data) => {
                if (data.res === true) {
                    this.setState({ askForPassword: false, wrongPassword: false, sendingStatus: data.res, dialogStatus: true })
                } else {
                    if (data.case === 1) {
                        this.setState({ wrongPassword: true })

                    } else if (data.case === 2) {
                        this.setState({ sendingStatus: data.res, dialogStatus: true, error: this.props.language["alert-invalid-address"] })
                    } else if (data.case === 3) {
                        this.setState({ sendingStatus: data.res, dialogStatus: true, error: this.props.language["send-hyc-fail"] })
                    }
                }
            }).catch((err: Error) => {
                console.error(err)
                this.setState({ sendingStatus: false, dialogStatus: true, error: err })
            })
    }

    private handleSubmit() {
        if (this.state.toAddress === "" || this.state.amountSending === "" || this.state.miningFee === "") {
            this.setState({ errorCode: 1 })
            return
        } else if (this.state.amountSending <= 0) {
            this.setState({ errorCode: 2 })
            return
        } else if (this.state.amountSending.match(patternHycon) === null) {
            this.setState({ errorCode: 3 })
            return
        } else if (this.state.miningFee.match(patternHycon) === null) {
            this.setState({ errorCode: 4 })
            return
        } else if (this.hyconfromString(this.state.totalHYC).lessThan(this.hyconfromString(this.state.amountSending).add(this.hyconfromString(this.state.miningFee)))) {
            this.setState({ errorCode: 5 })
            return
        } else if (this.hyconfromString(this.state.miningFee).equals(0)) {
            this.setState({ errorCode: 6 })
            return
        } else if (this.state.fromAddress === this.state.toAddress) {
            this.setState({ errorCode: 7 })
            return
        } else if (this.state.toAddress && !patternAddress.test(this.state.toAddress)) {
            this.setState({ errorCode: 9 })
            return
        }

        if (window.localStorage.getItem("fingerprint") === "true") {
            window.Fingerprint.show({
                clientId: "Hycon Pocket",
                clientSecret: "2.0.0",
            }, () => { this.sendTransaction()
            }, () => { alert("Transaction cancelled, unable to authenticate fingerprint.") })
        } else {
            this.sendTransaction()
        }

    }

    private handleMaxClick(e: any) {
        if (this.state.totalHYC <= this.state.miningFee) {
            alert(this.props.language["alert-insufficient-balance"])
        } else {
            const max = Number(this.state.totalHYC) - Number(this.state.miningFee)
            this.setState({ amountSending: max.toFixed(9) })
        }
    }

    private handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value, errorCode: 0 })
    }

    private hyconfromString(val: string): Long {
        if (val === "" || val === undefined || val === null) { return Long.fromNumber(0, true) }
        if (val[val.length - 1] === ".") { val += "0" }
        const arr = val.toString().split(".")
        let hycon = Long.fromString(arr[0], true).multiply(Math.pow(10, 9))
        if (arr.length > 1) {
            arr[1] = arr[1].length > 9 ? arr[1].slice(0, 9) : arr[1]
            const subCon = Long.fromString(arr[1], true).multiply(Math.pow(10, 9 - arr[1].length))
            hycon = hycon.add(subCon)
        }
        return hycon.toUnsigned()
    }

    private openQrScanner() {
        this.setState({ isScanning: true, isScannedForContact: false })
        document.getElementById("body").style.visibility = "hidden"
        document.getElementById("blockexplorer").style.visibility = "hidden"
        window.QRScanner.scan((err, text) => {
            document.getElementById("body").style.visibility = "visible"
            document.getElementById("blockexplorer").style.visibility = "visible"

            if (text.charAt(0) === "H") {
                this.setState({ toAddress: text, isScanning: false, isScannedForContact: false })
            } else {
                const obj = JSON.parse(text)
                this.setState({ toAddress: obj.address, amountSending: obj.amount, isScanning: false, isScannedForContact: false })
            }
            window.QRScanner.destroy()
        })
        window.QRScanner.show(((status) => {
            document.getElementById("qrCloseButton").style.visibility = "visible"
        }))
    }

    private openQrScannerContact() {
        this.setState({ dialogAddContact: false, dialogContacts: false, isScanning: true, isScannedForContact: true })
        document.getElementById("body").style.visibility = "hidden"
        document.getElementById("blockexplorer").style.visibility = "hidden"
        window.QRScanner.scan((err, text) => {
            document.getElementById("body").style.visibility = "visible"
            document.getElementById("blockexplorer").style.visibility = "visible"

            if (text.charAt(0) === "H") {
                this.setState({ contactAddress: text, isScannedForContact: true })
            } else {
                this.setState({ contactAddress: JSON.parse(text).address, isScannedForContact: true })
            }

            window.QRScanner.destroy()
            this.setState({ dialogAddContact: true, dialogContacts: true, isScanning: false, isScannedForContact: true })
        })
        window.QRScanner.show(((status) => {
            document.getElementById("qrCloseButton").style.visibility = "visible"
        }))
    }

    private closeScan() {
        window.QRScanner.destroy()
        if (this.state.isScannedForContact) {
            this.setState({ dialogAddContact: true, dialogContacts: true, isScanning: false })
        } else {
            this.setState({ isScanning: false })
        }
        document.getElementById("qrCloseButton").style.visibility = "hidden"
        document.getElementById("body").style.visibility = "visible"
        document.getElementById("blockexplorer").style.visibility = "visible"
    }
}

export default withStyles(styles)(SendHyc)
