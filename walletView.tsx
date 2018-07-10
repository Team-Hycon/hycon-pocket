import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import CircularProgress from "@material-ui/core/CircularProgress"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import Fade from "@material-ui/core/Fade"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Snackbar from "@material-ui/core/Snackbar"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import RequestIcon from "@material-ui/icons/ArrowDownward"
import SendIcon from "@material-ui/icons/ArrowUpward"
import BlurOn from "@material-ui/icons/BlurOn"
import DeleteIcon from "@material-ui/icons/Delete"
import CopyIcon from "@material-ui/icons/FileCopy"
import MoreIcon from "@material-ui/icons/MoreVert"
import * as React from "react"
import * as CopyToClipboard from "react-copy-to-clipboard"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import { IText } from "../locales/mobile/m_locales"
import { IHyconWallet, IMinedInfo, IResponseError, IRest, ITxProp } from "../rest"

// tslint:disable:object-literal-sort-keys
const styles = createStyles({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        overflowScrolling: "touch",
        WebkitOverflowScrolling: "touch",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
    },
    txInfo: {
        backgroundColor: "gray",
        borderWidth: 1,
        borderColor: "gray",
        color: "white",
        borderRadius: "10px",
        fontSize: "10px",
        minWidth: "52px",
        display: "inline-block",
        textAlign: "center",
    },
    swipeArea: {
        borderTop: 1,
        borderLeft: 1,
        borderRight: 1,
        borderRadius: 4,
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
        backgroundColor: "white",
        bottom: 0,
        position: "fixed",
        marginBottom: "constant(safe-area-inset-bottom), env(safe-area-inset-bottom)",
    },
})

// tslint:disable:no-var-requires
const QRCode = require("qrcode.react")
const html2canvas = require("html2canvas")
const pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/

interface IProps {
    rest: IRest
    language: IText
    select: (wallet: any) => void
    name: string
}
// tslint:disable-next-line:no-empty-interface
interface IState {
    rest: IRest
    language: IText
    name: string
    wallet: IHyconWallet[]
    copied: boolean
    txs: ITxProp[]
    pendings: ITxProp[]
    address: string
    notFound: boolean
    balance: string
    pendingAmount: string
    askDelete: boolean
    isDeleted: boolean
    qrDrawer: boolean
    reqDrawer: boolean
    pendingSize: number
    anchorEl: any
    amountSending: any
    createQr: boolean
}
export class WalletView extends React.Component<IProps, IState> {
    public mounted: boolean = false
    public position: number

    constructor(props: IProps) {
        super(props)

        this.state = {
            rest: this.props.rest,
            language: this.props.language,
            wallet: [{ name: "", address: "" }],
            copied: false,
            txs: [],
            pendings: [],
            address: "",
            notFound: false,
            name: this.props.name,
            balance: "0",
            pendingAmount: "0",
            askDelete: false,
            isDeleted: false,
            qrDrawer: false,
            reqDrawer: false,
            pendingSize: 0,
            anchorEl: null,
            amountSending: "",
            createQr: false,
        }
        this.position = 0
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public componentWillUnmount() {
        this.mounted = false
    }

    public componentDidMount() {
        this.mounted = true
        this.props.rest.getWalletDetail(this.state.name).then((data: IHyconWallet & IResponseError) => {
            if (this.mounted && data.address) {
                this.setState({ name: this.state.name, address: data.address, balance: data.balance, txs: data.txs, pendings: data.pendings, pendingAmount: data.pendingAmount, pendingSize: data.pendings.length })
                this.props.select({ name: this.state.name, address: data.address, balance: data.balance, txs: data.txs, pendings: data.pendings, pendingAmount: data.pendingAmount, pendingSize: data.pendings.length })
            } else {
                this.setState({ notFound: true })
            }
        }).catch((e: Error) => {
            alert(e)
        })
    }
    public handleClick = () => {
        this.setState({ copied: true })
    }
    public handleClose = () => {
        this.setState({ copied: false, askDelete: false, anchorEl: null })
    }
    public toggleQRDrawer = (open: any) => () => {
        if (!this.state.reqDrawer) {
            this.setState({ qrDrawer: open })
        }
    }
    public toggleReqDrawer = (open: any) => () => {
        this.setState({ reqDrawer: open })
        if (!open) {
            this.setState({ amountSending: "" })
        }
        if (this.state.createQr) {
            this.setState({ createQr: open })
        }
    }
    public toggleMenu = (event: any) => {
        this.setState({ anchorEl: event.currentTarget })
    }
    public handleDelete = () => {
        this.state.rest.deleteWallet(this.state.name).then((res) => {
            if (res) {
                this.setState({
                    isDeleted: true,
                })
            } else {
                alert(this.props.language["alert-delete-wallet-fail"])
            }
        })
        this.setState({ copied: false, askDelete: false })
    }
    public render() {
        if (this.state.notFound) {
            return <div>{this.props.language["detail-no-data"]}</div>
        }
        if (!this.state.notFound && this.state.wallet === undefined) {
            return <div></div>
        }
        if (this.state.isDeleted === true) {
            return (<Redirect to="/" />)
        }
        return (
            <Grid container style={styles.root}>
                <Grid item xs={12}>
                    <AppBar style={{ background: "transparent", boxShadow: "none", zIndex: 0 }} position="static">
                        <Toolbar style={styles.header}>
                            <Link to="/">
                                <IconButton><ArrowBackIcon /></IconButton>
                            </Link>
                            <Typography variant="button" align="center">
                                {this.props.language["detail-title"]}<b>{this.state.name}</b>
                            </Typography>
                            <IconButton onClick={this.deleteWallet.bind(this)}><DeleteIcon /></IconButton>
                        </Toolbar>
                    </AppBar>
                    <Divider />
                </Grid>
                <Card elevation={0}>
                    <CardContent>
                        <Card elevation={1}>
                            <CardContent>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <TextField
                                            disabled
                                            fullWidth
                                            value={this.state.address}
                                            inputProps={{ "aria-label": "Wallet Address" }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <CopyToClipboard text={this.state.address}>
                                                            <IconButton onClick={this.handleClick}>
                                                                <CopyIcon style={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </CopyToClipboard>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" align="left" gutterBottom>
                                            {this.props.language["detail-your-balance"]}
                                        </Typography>
                                        <Typography variant="h4" align="left">
                                            {this.state.balance} HYC
                                        </Typography>
                                    </Grid>
                                    {this.state.pendingAmount !== "0" ?
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6" align="left" gutterBottom>
                                                {this.props.language["activity-pending"]}:
                                            </Typography>
                                            <Typography variant="h4" align="left">
                                                {this.state.pendingAmount} HYC
                                            </Typography>
                                        </Grid> : ""
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                <Grid container direction="row" alignItems="center" justify="space-around">
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                        <Link to="/sendcoins" style={{ textDecoration: "none" }}>
                            <Button disabled={this.state.address === "" } variant="fab" mini aria-label="Send HYC" style={{ backgroundColor: "#2195a0", color: "white" }}>
                                <SendIcon />
                            </Button>
                        </Link>
                        <Typography variant="caption" style={{ paddingTop: 10 }}>
                            {this.props.language["btn-send"]}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                        <Button disabled={this.state.address === "" } variant="fab" onClick={this.toggleReqDrawer(true)} mini aria-label="Receive HYC" style={{ backgroundColor: "#172349", color: "white" }}>
                            <RequestIcon />
                        </Button>
                        <Typography variant="caption" style={{ paddingTop: 10 }}>
                            {this.props.language["btn-request"]}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                        <Button variant="fab" mini
                            aria-label="More"
                            aria-owns={this.state.anchorEl ? "more-menu" : undefined}
                            aria-haspopup="true"
                            onClick={this.toggleMenu}
                        >
                            <MoreIcon color="primary" />
                        </Button>
                        <Typography variant="caption" style={{ paddingTop: 10 }}>
                            {this.props.language["btn-more"]}
                        </Typography>
                    </Grid>
                </Grid>
                <Card elevation={0} style={{ paddingBottom: 30 }}>
                    <CardContent>
                        {this.state.pendings.concat(this.state.txs).length !== 0 ?
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" align="left" gutterBottom>
                                    {this.props.language["detail-last"]} {this.state.pendings.concat(this.state.txs).length} {this.props.language["detail-txs"]}
                                </Typography>
                                <List>
                                    {this.state.pendings.concat(this.state.txs) != null ?
                                        this.state.pendings.concat(this.state.txs).map((n: any, index: number) => (
                                            <ListItem key={"transaction" + n} style={{ padding: "5px 0 0 0" }}>
                                                <Card elevation={1} style={{ width: "100%" }}>
                                                    {this.getTransactionStyle(n.from) === "SEND" ?
                                                        <CardHeader
                                                            disableTypography
                                                            title={
                                                                <Typography variant="body1" style={{ color: "white" }}>
                                                                    {this.getTransactionStyle(n.from) + (this.testCompleted(index) ? ` HYC - ${this.props.language["activity-completed"]}` : ` HYC - ${this.props.language["activity-pending"]}`)}
                                                                </Typography>
                                                            }
                                                            subheader={
                                                                <Typography variant="body2" style={{ color: "white" }}>
                                                                    {this.testCompleted(index) ? this.getDate(Number(n.receiveTime)) : ""}
                                                                </Typography>
                                                            }
                                                            style={{ padding: "4px 16px", background: "linear-gradient(to right, #2195a0, #172349)" }}
                                                        /> :
                                                        <CardHeader
                                                            disableTypography
                                                            title={
                                                                <Typography variant="body1" style={{ color: "white" }}>
                                                                    {this.getTransactionStyle(n.from) + (this.testCompleted(index) ? ` HYC - ${this.props.language["activity-completed"]}` : ` HYC - ${this.props.language["activity-pending"]}`)}
                                                                </Typography>
                                                            }
                                                            subheader={
                                                                <Typography variant="body2" style={{ color: "white" }}>
                                                                    {this.testCompleted(index) ? this.getDate(Number(n.receiveTime)) : ""}
                                                                </Typography>
                                                            }
                                                            style={{ padding: "4px 16px", background: "linear-gradient(to right, #172349, #2195a0)" }}
                                                        />
                                                    }
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={12} sm={6} zeroMinWidth>
                                                                <Typography noWrap>
                                                                    <span style={styles.txInfo}>{this.props.language["detail-amount"]}</span>
                                                                    <b>{"  " + n.amount + " HYC"}</b>
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} zeroMinWidth>
                                                                <Typography noWrap>
                                                                    <span style={styles.txInfo}>{this.props.language["detail-fee"]}</span>
                                                                    {"  " + n.fee + " HYC"}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} zeroMinWidth>
                                                                <Typography noWrap>
                                                                    <span style={styles.txInfo}>{this.props.language["detail-from"]}</span>
                                                                    {"  " + n.from}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} zeroMinWidth>
                                                                <Typography noWrap>
                                                                    <span style={styles.txInfo}>{this.props.language["detail-to"]}</span>
                                                                    {"  " + n.to}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} zeroMinWidth>
                                                                <Typography noWrap>
                                                                    <span style={styles.txInfo}>{this.props.language["detail-hash"]}</span>
                                                                    {"  " + n.hash}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </ListItem>
                                        )) : <div>waiting data</div>
                                    }
                                </List>
                            </Grid> :
                            <Grid item xs={12} style={{ flexGrow: 1 }}>
                                <Typography variant="h6" align="center">
                                    {this.props.language["detail-guide3"]}
                                </Typography>
                                <Typography variant="caption" align="center">
                                    {this.props.language["detail-guide4"]}
                                </Typography>
                            </Grid>
                        }
                    </CardContent>
                </Card>
                <Grid container spacing={0} style={styles.swipeArea} onClick={this.toggleQRDrawer(true)}>
                    <Grid item xs={12} justify="center" style={{ textAlign: "center", marginTop: "5px" }}>
                        <BlurOn />
                    </Grid>
                    <Grid item xs={12} justify="center" style={{ textAlign: "center", marginBottom: "10px" }}>
                        <Typography variant="caption">{this.props.language["detail-share-qr"]}</Typography>
                    </Grid>
                </Grid>

                <Menu id="more-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.handleClose}>
                    <MenuItem onClick={this.handleClose}>{this.props.language["help-comming-soon"]}</MenuItem>
                </Menu>
                <SwipeableDrawer
                    anchor="bottom"
                    open={this.state.qrDrawer}
                    onClose={this.toggleQRDrawer(false)}
                    onOpen={this.toggleQRDrawer(true)}
                    swipeAreaWidth={30}
                    disableDiscovery
                >
                    <Card elevation={0} square>
                        <CardContent>
                            <Grid container alignItems="center" alignContent="center">
                                {this.state.address !== "" ? <QRCode size={192} style={{ margin: "0 auto" }} value={JSON.stringify({ address: this.state.address })} /> : <CircularProgress />}
                            </Grid>
                        </CardContent>
                    </Card>
                </SwipeableDrawer >

                <Drawer
                    anchor="bottom"
                    open={this.state.reqDrawer}
                    onClose={this.toggleReqDrawer(false)}
                >
                    <Card elevation={0} square>
                        <CardContent>
                            <Grid container alignItems="center" alignContent="center">
                                <Grid item xs={12}>
                                    <TextField
                                        value={this.state.amountSending}
                                        type="number"
                                        label={this.props.language["ph-amount-to-request"]}
                                        placeholder="0"
                                        variant="outlined"
                                        onChange={this.handleChange.bind(this)}
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
                                <Grid item xs={12}>
                                    <Button
                                        onClick={this.handleSubmit.bind(this)}
                                        fullWidth
                                        size="medium"
                                        variant="text"
                                        style={{ backgroundColor: "#172349", color: "#fff" }}
                                    >
                                        {this.props.language["btn-create-qr"]}
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        this.state.createQr ?
                                            <div id="sendingCanvas"
                                                style={{ textAlign: "center" }}
                                                onClick={this.sendQr.bind(this)}>
                                                <Grid item xs={12} style={{ justifyContent: "center", paddingTop: "2%" }}>
                                                    <QRCode value={JSON.stringify({ address: this.state.address, amount: this.state.amountSending })} />
                                                </Grid>
                                                <Grid item xs={12} style={{ justifyContent: "center" }}>
                                                    <Typography variant="caption">{this.props.language["detail-request-share-qr"]}</Typography>
                                                </Grid>
                                            </div>
                                            :
                                            ""
                                    }
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Drawer>

                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={this.state.copied}
                    onClose={this.handleClose}
                    TransitionComponent={Fade}
                    ContentProps={{ "aria-describedby": "message-id" }}
                    message={<span id="message-id">{this.props.language["help-copied"]}</span>}
                />

                <Dialog
                    open={this.state.askDelete}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.language["help-notification"]}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.language["detail-delete-wallet"]}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            {this.props.language["btn-cancel"]}
                        </Button>
                        <Button onClick={this.handleDelete} color="primary" autoFocus>
                            {this.props.language["btn-yes"]}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid >
        )
    }

    private testCompleted(index: number): boolean {
        if (this.state.pendingSize === 0) {
            return true
        } else if (index >= this.state.pendingSize) {
            return true
        } else {
            return false
        }
    }

    private getTransactionStyle(add: string): string {
        if (add !== this.state.address) {
            return "RECEIVE"
        } else {
            return "SEND"
        }
    }

    private getDate(epoch: any): string {
        const d = new Date(epoch)

        let month = d.getMonth().toString()
        if (month.length === 1) {
            month = "0" + month
        }
        const str = d.getDate() + "/" + month + "/" + d.getFullYear() + " " + d.toLocaleTimeString()
        return str
    }
    private sendQr() {
        html2canvas(document.getElementById("sendingCanvas")).then((canvas: any) => {
            window.plugins.socialsharing.shareViaEmail(
                "Requesting " + this.state.amountSending + "HYC to the address " + this.state.address,
                this.state.amountSending + " Hycon Requested",
                null,
                null,
                null,
                [canvas.toDataURL()],
                (result) => { },
                (msg) => { },
            )

        })
    }

    private handleChange = (event: any) => {
        this.setState({ amountSending: event.target.value, createQr: false })
    }

    private handleSubmit() {
        if (this.state.amountSending <= 0 || this.state.amountSending.match(pattern1) == null) {
            alert(this.props.language["alert-9decimal-amount"])
            return
        }

        if (this.state.amountSending !== 0 && this.state.amountSending !== undefined) {
            this.setState({ createQr: true })
        }
    }
    private deleteWallet() {
        this.setState({ askDelete: true })
    }
}
