import { createStyles, FormControl } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import InputLabel from "@material-ui/core/InputLabel"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import SearchIcon from "@material-ui/icons/Search"
import Slider from "@material-ui/lab/Slider"
import * as React from "react"
import * as CopyToClipboard from "react-copy-to-clipboard"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"
// tslint:disable-next-line:no-var-requires
const Long = require("long")

const pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/
const scale = 9 * Math.log(10) / 100

const contacts = [{ name: "Cat", addr: "H123fj43333ffgewf" }, { name: "Sansa", addr: "H123fj43kl23j08hf" }, { name: "Rob", addr: "H90lfgd5r67koaq0" },
{ name: "Ned", addr: "H123fj43333ffgewf" }, { name: "Arya", addr: "H123fj43kl23j08hf" }, { name: "John", addr: "H90lfgd5r67koaq0" }]

// tslint:disable:object-literal-sort-keys
const styles = createStyles({
    root: {
        display: "flex",
        height: "100%",
    },
    header: {
        display: "flex",
        justifyContent: "flex-start",
    },
    container: {
        display: "flex",
        justifyContent: "center",
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

export class RequestHyc extends React.Component<IProps, any> {

    public static getDerivedStateFromProps(nextProps: IProps, previousState: any): any & IProps {
        return Object.assign(nextProps, {})
    }

    constructor(props: IProps) {
        super(props)
        // props.rest.getWalletList().then((w) => this.setWallets(w.walletList))
        this.state = {
            alertDialogShown: false,
            rangeValue: 0,
            totalHYC: 10,
            pendingHYC: 8,
            amountSending: 0,
            amountFee: 0,
            address: "",
            fromAddress: "test",
            toAddress: "",
            contactsShown: false,
            password: "",
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: any): boolean {
        return true
    }

    public render() {
        return (
            <div style={styles.root}>
                <Grid container direction="column" justify="space-between">
                    <Grid item>
                        <AppBar style={{ background: "transparent", boxShadow: "none", zIndex: 0 }} position="static">
                            <Toolbar style={styles.header}>
                                <Link to="/">
                                    <IconButton style={styles.menuButton}><ArrowBackIcon /></IconButton>
                                </Link>
                                <Typography variant="button" align="center">
                                    Request HYC
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Grid item>
                            <List component="nav" style={{ flex: "1 0 auto" }}>
                                <FormControl fullWidth>
                                    <Input
                                        id="search-address"
                                        value={this.state.toAddress}
                                        onChange={this.handleChange("toAddress")}
                                        placeholder="Enter a wallet address or select one from favorites"
                                        inputProps={{ "aria-label": "Search Address" }}
                                        style={{ fontSize: "0.8em" }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <IconButton onClick={this.handleContacts.bind(this)}>
                                                    <SearchIcon style={{ fontSize: 18 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <ListSubheader component="div" style={{ backgroundColor: "#FFF", fontSize: 9, lineHeight: "24px" }}>AMOUNT</ListSubheader>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item xs={3}>
                                                    <Button size="small" style={{ fontSize: 10 }} onClick={this.handleMaxClick.bind(this)}>
                                                        MAX
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Input
                                                        fullWidth
                                                        value={this.state.amountSending}
                                                        type="number"
                                                        placeholder="0.000000000"
                                                        onChange={this.handleChange("amountSending")}
                                                        inputProps={{ "aria-label": "Send Amount" }}
                                                        style={{ fontSize: "1.2em" }}
                                                        endAdornment={<InputAdornment position="end">HYC</InputAdornment>}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ListSubheader component="div" style={{ backgroundColor: "#FFF", fontSize: 9, lineHeight: "24px" }}>FEE</ListSubheader>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item xs={3}>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Input
                                                        fullWidth
                                                        value={this.state.amountFee}
                                                        type="number"
                                                        placeholder="0.000000000"
                                                        onChange={this.handleChange("amountFee")}
                                                        inputProps={{ "aria-label": "Send Fee" }}
                                                        style={{ fontSize: "1.2em" }}
                                                        endAdornment={<InputAdornment position="end">HYC</InputAdornment>}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem style={{ padding: 0, margin: 0 }}>
                                            <Grid container>
                                                <Grid item xs={2}>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Slider value={this.state.amountFee}
                                                        min={0} max={this.state.totalHYC - this.state.amountSending}
                                                        aria-labelledby="Send Fee"
                                                        onChange={this.handleFeeSlider}
                                                        style={{ padding: 0 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={2}>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: "4%" }}>
                                        <ListSubheader component="div" style={{ backgroundColor: "#FFF", fontSize: 9, lineHeight: "24px" }}>QR Code</ListSubheader>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography align="center" style={{ fontSize: "0.8em", paddingBottom: "10%" }}>
                                                        Please show the sender the generated QR Code.
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography align="center" style={{ fontSize: "1.2em", paddingBottom: "10%" }}>
                                                        Placeholder: QR Code
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </Grid>
                                </Grid>
                            </List>
                        </Grid>
                    </Grid>
                    <Grid item alignContent="center">
                        <Link to="/">
                            <Button
                                style={{ backgroundColor: "#2196f3", color: "#fff", width: "100%", height: "8%" }}>
                                COMPLETE
                            </Button>
                        </Link>
                    </Grid>
                </Grid>

                <Modal aria-labelledby="contact-list" open={this.state.contactsShown} onClose={this.handleContactsClose.bind(this)}>
                    <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute" }}>
                        <Paper style={{ padding: 10, maxWidth: 375 }}>
                            <List subheader={<ListSubheader style={{ fontSize: 10 }}>Select a wallet address</ListSubheader>}>
                                {contacts.map((value) => (
                                    <div>
                                        <ListItem button key={value.addr} onClick={this.setContactandClose(value.addr)}>
                                            <ListItemText primary={value.name} secondary={value.addr} />
                                        </ListItem>
                                        <Divider />
                                    </div>
                                ))}
                            </List>
                        </Paper>
                    </div>
                </Modal>
            </div >
        )
    }

    private onClickHint() {
        this.setState({ alertDialogShown: true })
    }

    private hideAlertDialog() {
        this.setState({ alertDialogShown: false })
    }

    private handleContacts() {
        this.setState({ contactsShown: true })
    }

    private setContactandClose = (prop: any) => (event: any) => {
        this.setState({ toAddress: prop })
        this.handleContactsClose()
    }

    private handleContactsClose() {
        this.setState({ contactsShown: false })
    }

    private handleSubmit(e: any) {

        const sending = Number(this.state.amountSending) + Number(this.state.amountFee)
        const left = Number(this.state.totalMoney) - Number(sending)

        if (this.state.amountSending <= 0) {
            alert("Enter a valid transaction amount")
            return
        }
        if (this.state.amountSending.match(pattern1) == null) {
            alert("Please enter a number with up to 9 decimal places")
            return
        }
        if (this.hyconfromString(this.state.totalHYC).lessThan(this.hyconfromString(this.state.amountSending).add(this.hyconfromString(this.state.amountFee)))) {
            alert("Insufficient Funds")
            return
        }
        if (this.hyconfromString(this.state.amountFee).equals(0)) {
            alert("Enter a valid miner fee")
            return
        }
        if (this.state.fromAddress === this.state.toAddress) {
            alert("You cannot send HYCON to yourself")
            return
        }
        if (this.state.toAddress === "" || this.state.toAddress === undefined) {
            alert("Enter a to address")
            return
        }

        console.log("User send : " + this.hyconfromString(this.state.amountSending).add(this.hyconfromString(this.state.amountFee))
            + " Hyc. Amount is " + this.hyconfromString(this.state.amountSending) + " and miner fee is " + this.hyconfromString(this.state.amountFee))

    }

    private handleMaxClick(e: any) {
        const max = Number(this.state.totalMoney) - 0.0001
        const minerFee = 0.0001
        const displayFee = Math.round(Math.log(10e8 * minerFee) / scale)
        this.setState({ amountSending: max.toString(), amountFee: minerFee.toString() })
    }

    private handleFeeSlider = (event: any, value: any) => {
        this.setState({ value, amountFee: value })
    }
    private handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
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
}
