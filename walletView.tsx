import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import ButtonBase from "@material-ui/core/ButtonBase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Chip from "@material-ui/core/Chip"
import CircularProgress from "@material-ui/core/CircularProgress"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Collapse from "@material-ui/core/Collapse"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import Fade from "@material-ui/core/Fade"
import Grid from "@material-ui/core/Grid"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import LinearProgress from "@material-ui/core/LinearProgress"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Snackbar from "@material-ui/core/Snackbar"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import createStyles from "@material-ui/core/styles/createStyles"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import RequestIcon from "@material-ui/icons/ArrowDownward"
import SendIcon from "@material-ui/icons/ArrowUpward"
import BlurOn from "@material-ui/icons/BlurOn"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import TooltipIcon from "@material-ui/icons/Help"
import MoreIcon from "@material-ui/icons/MoreVert"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import { Textfit } from "@wootencl/react-textfit"
import * as React from "react"
import * as CopyToClipboard from "react-copy-to-clipboard"
import { PullToRefresh } from "react-js-pull-to-refresh"
import { Link } from "react-router-dom"
import { IHyconWallet, IRest } from "../rest"
import ColorButton from "./component/ColorButton"
import { FeeSettings } from "./content/feeSettings"
import { IText } from "./locales/m_locales"
import { IPrice } from "./mobileClient"

const styles = (theme: Theme) => createStyles({
    balanceSelect: {
        color: "black",
        fontSize: 12,
        height: 20,
        marginRight: 5,
    },
    balanceSelectFocus: {
        "&:active": {
            backgroundColor: "#172349",
        },
        "&:focus": {
            backgroundColor: "#172349",
        },
        "&:hover": {
            backgroundColor: "#172349",
        },
        "backgroundColor": "#172349",
        "color": "white",
        "fontSize": 12,
        "height": 20,
        "marginRight": 5,
    },
    bottomToolbar: {
        alignItems: "center",
        justifyContent: "space-around",
        [theme.breakpoints.up("sm")]: {
            marginLeft: 300,
        },
    },
    bottomToolbarBtn: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    btn: {
        color: theme.palette.type === "dark" ? "white" : "#172349",
    },
    dialogPaper: {
        minHeight: 200,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
    },
    root: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflowY: "scroll",
    },
    swipeArea: {
        backgroundColor: theme.palette.type === "light" ? "white" : "#424242",
        borderTop: "1px solid #ededf3",
        bottom: 0,
        paddingBottom: "env(safe-area-inset-bottom)",
        top: "auto",
    },
    toolbar: theme.mixins.toolbar,
    txInfo: {
        backgroundColor: "gray",
        borderColor: "gray",
        borderRadius: "10px",
        borderWidth: 1,
        color: "white",
        display: "inline-block",
        fontSize: "10px",
        minWidth: "52px",
        textAlign: "center",
    },
})

// tslint:disable:no-var-requires
const QRCode = require("qrcode.react")
const html2canvas = require("html2canvas")
const pattern1 = /(^[0-9]*)([.]{0,1}[0-9]{0,9})$/
const wallet = require("./img/wallet.png")
const storage = window.localStorage

interface IProps extends WithStyles<typeof styles> {
    rest: IRest
    language: IText
    price: IPrice
    wallet: IHyconWallet
    name: string
    paletteType: string
    oneHanded: boolean
    setWallets: (fromDelete?: boolean) => void
    showBalance: boolean
    handleDialog: (open: boolean) => void
    handleWalletSelect: (name: string) => void
    updateSelected: (name: string) => void
}
class WalletView extends React.PureComponent<IProps, any> {
    private balanceIndex: number = 0

    constructor(props: IProps) {
        super(props)

        let wallets = JSON.parse(storage.getItem("/wallets"))

        if (!wallets) {
            const obj = {}
            obj[this.props.name] = { miningFee: "" }
            obj[""] = { miningFee: "" }
            storage.setItem("/wallets", JSON.stringify(obj))
            wallets = JSON.parse(storage.getItem("/wallets"))
        } else if (!wallets[this.props.name]) {
            wallets[this.props.name] = { miningFee: "" }
            storage.setItem("/wallets", JSON.stringify(wallets))
            wallets = JSON.parse(storage.getItem("/wallets"))
        }

        this.state = {
            amountSending: "",
            anchorEl: null,
            askDelete: false,
            balance: { fiat: "", eth: "", btc: "" },
            collapse: storage.getItem("walletViewCollapse") !== null ? (storage.getItem("walletViewCollapse") === "true") : true,
            copied: false,
            createQr: false,
            dialogMore: false,
            displayedBalance: this.props.wallet.balance + " HYC",
            globalFee: wallets[""].miningFee === null ? false : wallets[""].miningFee !== "",
            hasMnemonic: false,
            isDeleted: false,
            isExpand: false,
            language: this.props.language,
            miningFee: wallets[this.props.name].miningFee === "" ? wallets[""].miningFee : "",
            name: this.props.name,
            notFound: false,
            openMnemonic: false,
            password: "",
            passwordInvalid: false,
            passwordValidated: false,
            price: this.props.price,
            qrDrawer: false,
            refreshed: false,
            reqDrawer: false,
            rest: this.props.rest,
            showPassword: false,
            tooltipOpen: false,
            update: false,
            wallet: this.props.wallet,
        }
    }

    public componentDidMount() {
        document.addEventListener("backbutton", (event) => {
            event.preventDefault()
            if (this.state.qrDrawer || this.state.reqDrawer || this.state.askDelete || this.state.openMnemonic || this.state.dialogMore || Boolean(this.state.anchorEl)) {
                this.setState({ qrDrawer: false, reqDrawer: false, askDelete: false, openMnemonic: false, dialogMore: false, anchorEl: null })
            } else {
                this.forceUpdate()
            }
            return
        }, false)
    }

    public componentWillUnmount() {
        document.removeEventListener("backbutton", (event) => {
            event.preventDefault()
            if (this.state.qrDrawer || this.state.reqDrawer || this.state.askDelete || this.state.openMnemonic || this.state.dialogMore || Boolean(this.state.anchorEl)) {
                this.setState({ qrDrawer: false, reqDrawer: false, askDelete: false, openMnemonic: false, dialogMore: false, anchorEl: null })
            } else {
                this.forceUpdate()
            }
            return
        }, false)
    }

    public componentDidUpdate() {
        const hycBalanceNum = Number(this.state.wallet.balance)
        this.state.balance.fiat = (this.props.price.fiat * hycBalanceNum)
        this.state.balance.btc = (this.props.price.btc * hycBalanceNum).toFixed(9)
        this.state.balance.eth = (this.props.price.eth * hycBalanceNum).toFixed(9)
    }
    public async componentWillReceiveProps(nextProps: any) {
        if (nextProps.wallet.name !== nextProps.name) {
            this.props.updateSelected(this.state.name)
        } else {
            this.setState({ name: nextProps.name, wallet: nextProps.wallet }, () => {
                this.setState({ displayedBalance: this.displayBalance(), hasMnemonic: nextProps.wallet.mnemonic !== "" ? true : false })
            })
        }
    }

    public render() {
        if (this.state.notFound) {
            return <div>{this.props.language["detail-no-data"]}</div>
        }
        if (this.props.name === "") {
            return (
                <Grid container className={this.props.classes.root} style={{ justifyContent: "space-around"}}>
                    <Grid item xs={12}>
                        <Link to="/addwallet" onClick={() => this.props.handleDialog(true)} style={{ textDecoration: "none" }}>
                            <div style={{ textAlign: "center" }}>
                                <img style={{ maxHeight: 160 }} src={wallet} />
                                <Typography variant="h6" align="center" style={{ marginTop: 10, fontWeight: 600 }}>{this.props.language["no-wallet"]}</Typography>
                                <Typography variant="caption" align="center">{this.props.language["no-wallet-action"]}</Typography>
                            </div>
                        </Link>
                    </Grid>
                </Grid>
            )
        }

        return (
            <Grid container className={this.props.classes.root}>
                <div style={{ width: "100%" }}>
                    {(this.props.name !== "" && this.props.wallet.address === "") || (this.props.name !== this.props.wallet.name) ? <LinearProgress /> : null}
                    <PullToRefresh
                        pullDownContent={<span />}
                        releaseContent={<span />}
                        refreshContent={<LinearProgress />}
                        pullDownThreshold={5}
                        onRefresh={this.onRefresh.bind(this)}
                        triggerHeight={250}
                    >
                        <Card elevation={0} square style={{
                            background: this.props.paletteType === "light" ? "linear-gradient(to bottom, #ededf3 90%,#fff 100%)" : "linear-gradient(to bottom, #212121 90%,#303030 100%)",
                            padding: "40px 0" }}
                        >
                            <CardContent>
                                <Hidden smUp implementation="js">
                                    <div className={this.props.classes.toolbar} />
                                </Hidden>
                                <Grid container spacing={0}>
                                    <Grid item style={{ width: "90%" }}>
                                        <Textfit
                                            mode="single"
                                            style={{ color: this.props.paletteType === "light" ? "black" : "white" }}
                                            throttle={0}
                                            min={20}
                                            max={50}
                                        >
                                            <span style={{ fontWeight: 600 }}>{this.state.name}</span>
                                            <span>{this.props.language["title-wallet"]}</span>
                                        </Textfit>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CopyToClipboard text={this.state.wallet.address} onCopy={this.handleClick}>
                                            <Typography variant="caption" style={{ fontWeight: 400, fontStyle: "monospace" }}>
                                                {this.state.wallet.address}
                                            </Typography>
                                        </CopyToClipboard>
                                    </Grid>
                                    <Grid item xs={12} style={{ padding: "20px 0" }}>
                                        <Grid container direction="row" alignItems="center" justify="space-between">
                                            <Grid item style={{ width: "80%", fontFamily: "Source Code Pro, monospace" }}>
                                                <Textfit
                                                    mode="single"
                                                    style={{ color: this.props.paletteType === "light" ? "black" : "white" }}
                                                    throttle={100}
                                                    min={18}
                                                    max={42}
                                                    onClick={this.switchBalance.bind(this, -1)}
                                                >
                                                    {this.props.showBalance ? this.state.displayedBalance : this.props.language["balance-hidden"]}
                                                </Textfit>
                                            </Grid>
                                            <Grid item>
                                                <IconButton onClick={this.handleCollapse}>
                                                    {this.state.collapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Collapse in={this.state.collapse}>
                                                <Grid container direction="row" alignItems="center" justify="space-between">
                                                    <Grid item>
                                                        <Chip
                                                            label="HYC"
                                                            onClick={this.switchBalance.bind(this, 0)}
                                                            className={this.balanceIndex === 0 ? this.props.classes.balanceSelectFocus : this.props.classes.balanceSelect}
                                                        />
                                                        <Chip
                                                            label={this.props.language.currency.toUpperCase()}
                                                            onClick={this.switchBalance.bind(this, 1)}
                                                            className={this.balanceIndex === 1 ? this.props.classes.balanceSelectFocus : this.props.classes.balanceSelect}
                                                        />
                                                        <Chip
                                                            label="Ethereum"
                                                            onClick={this.switchBalance.bind(this, 2)}
                                                            className={this.balanceIndex === 2 ? this.props.classes.balanceSelectFocus : this.props.classes.balanceSelect}
                                                        />
                                                        <Chip
                                                            label="Bitcoin"
                                                            onClick={this.switchBalance.bind(this, 3)}
                                                            className={this.balanceIndex === 3 ? this.props.classes.balanceSelectFocus : this.props.classes.balanceSelect}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <ClickAwayListener onClickAway={this.handleTooltipClose}>
                                                            <Tooltip
                                                                disableTouchListener
                                                                interactive
                                                                open={this.state.tooltipOpen}
                                                                onClose={this.handleTooltipClose}
                                                                title={this.props.language["datail-balance-tooltip"]}
                                                                style={{ fontSize: "0.5em" }}
                                                            >
                                                                <IconButton>
                                                                    <TooltipIcon onClick={this.handleTooltipOpen} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </ClickAwayListener>
                                                    </Grid>
                                                </Grid>
                                            </Collapse>
                                        </Grid>
                                    </Grid>
                                    {this.state.wallet.pendingAmount !== "0" ?
                                        <Grid item xs={12}>
                                            <Typography variant="h6" align="left" gutterBottom>
                                                {this.props.language["activity-pending"]}:
                                            </Typography>
                                            <Typography variant="h4" align="left">
                                                {this.state.wallet.pendingAmount} HYC
                                            </Typography>
                                        </Grid> : ""
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card elevation={0} style={{ backgroundColor: "transparent", paddingBottom: 30 }} square>
                            <CardContent>
                                {((this.state.wallet.pendings.concat(this.state.wallet.txs).length !== 0) && this.props.showBalance) ?
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" align="left" gutterBottom>
                                            {this.props.language["detail-last"]} {this.state.wallet.pendings.concat(this.state.wallet.txs).length} {this.props.language["detail-txs"]}
                                        </Typography>
                                        <List>
                                            {this.state.wallet.pendings.concat(this.state.wallet.txs) != null ?
                                                this.state.wallet.pendings.concat(this.state.wallet.txs).map((n: any, index: number) => (
                                                    <ListItem key={"transaction" + n} style={{ padding: "5px 0 0 0" }}>
                                                        <Card elevation={1} style={{ width: "100%" }}>
                                                            {this.getTransactionStyle(n.from) === "SEND" ?
                                                                <CardHeader
                                                                    disableTypography
                                                                    title={
                                                                        <Typography variant="body1" style={{ color: "white" }}>
                                                                            {this.getTransactionStyle(n.from) + (this.testCompleted(index) ? ` HYC - ${this.props.language["tx-completed"]}` : ` HYC - ${this.props.language["tx-pending"]}`)}
                                                                        </Typography>
                                                                    }
                                                                    subheader={
                                                                        <Typography variant="body2" style={{ color: "white" }}>
                                                                            {this.testCompleted(index) ? this.getDate(Number(n.receiveTime)) : ""}
                                                                        </Typography>
                                                                    }
                                                                    style={{ padding: "4px 16px", background: "linear-gradient(to right, #2195a0, #172349)" }}
                                                                /> :
                                                                this.getTransactionStyle(n.from) === "RECEIVE" ?
                                                                    <CardHeader
                                                                        disableTypography
                                                                        title={
                                                                            <Typography variant="body1" style={{ color: "white" }}>
                                                                                {this.getTransactionStyle(n.from) + (this.testCompleted(index) ? ` HYC - ${this.props.language["tx-completed"]}` : ` HYC - ${this.props.language["tx-pending"]}`)}
                                                                            </Typography>
                                                                        }
                                                                        subheader={
                                                                            <Typography variant="body2" style={{ color: "white" }}>
                                                                                {this.testCompleted(index) ? this.getDate(Number(n.receiveTime)) : ""}
                                                                            </Typography>
                                                                        }
                                                                        style={{ padding: "4px 16px", background: "linear-gradient(to right, #172349, #2195a0)" }}
                                                                    /> :
                                                                    <CardHeader
                                                                        disableTypography
                                                                        title={
                                                                            <Typography variant="body1" style={{ color: "white" }}>
                                                                                {this.getTransactionStyle(n.from)}
                                                                            </Typography>
                                                                        }
                                                                        subheader={
                                                                            <Typography variant="body2" style={{ color: "white" }}>
                                                                                {this.testCompleted(index) ? this.getDate(Number(n.receiveTime)) : ""}
                                                                            </Typography>
                                                                        }
                                                                        style={{ padding: "4px 16px", background: "#22759c" }}
                                                                    />

                                                            }
                                                            <CardContent>
                                                                {this.getTransactionStyle(n.from) === "GIFTCARD" ?
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={6} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-amount"]}</span>
                                                                                <b>{"  " + n.amount + " HYC"}</b>
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-hash"]}</span>
                                                                                {"  " + n.hash}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid> :
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={6} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-amount"]}</span>
                                                                                <b>{"  " + n.amount + " HYC"}</b>
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-fee"]}</span>
                                                                                {"  " + n.fee + " HYC"}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-from"]}</span>
                                                                                {"  " + n.from}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-to"]}</span>
                                                                                {"  " + n.to}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} zeroMinWidth>
                                                                            <Typography noWrap>
                                                                                <span className={this.props.classes.txInfo}>{this.props.language["detail-hash"]}</span>
                                                                                {"  " + n.hash}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                }
                                                            </CardContent>
                                                        </Card>
                                                    </ListItem>
                                                )) : <div>waiting data</div>
                                            }
                                        </List>
                                    </Grid> :
                                    <Grid item xs={12} style={{ flexGrow: 1 }}>
                                        <Typography variant="h6" align="center">
                                            {this.props.showBalance ? this.props.language["detail-guide-make-your-tx"] : this.props.language["txs-hidden"]}
                                        </Typography>
                                        <Typography variant="caption" align="center">
                                            {this.props.showBalance ? this.props.language["detail-guide-tap-send-or-request"] : this.props.language["txs-hidden-help"]}
                                        </Typography>
                                    </Grid>
                                }
                            </CardContent>
                        </Card>

                        <Menu id="more-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.handleClose}>
                            <MenuItem onClick={this.showMnemonic.bind(this)}>{this.props.language["show-mnemonic"]}</MenuItem>
                            <Link to="/giftcard" style={{ textDecoration: "none" }}><MenuItem onClick={this.redirectGiftcard}>{this.props.language["redeem-giftcard"]}</MenuItem></Link>
                            <MenuItem onClick={this.handleDialogMore}>{this.props.language["wallet-settings"]}</MenuItem>
                            <MenuItem onClick={this.deleteWallet.bind(this)} style={{ color: "red", fontWeight: 400 }}>{this.props.language["btn-delete-wallet"]}</MenuItem>
                        </Menu>

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
                                                fullWidth
                                                value={this.state.amountSending}
                                                type="number"
                                                label={this.props.language["ph-amount-to-request"]}
                                                placeholder="0"
                                                onChange={this.handleChange.bind(this)}
                                                style={{ marginBottom: "15px" }}
                                                inputProps={{ style: { textAlign: "right" } }}
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
                                            <ColorButton fullWidth onClick={this.handleSubmit.bind(this)}>{this.props.language["btn-create-qr"]}</ColorButton>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {
                                                this.state.createQr ?
                                                    <div id="sendingCanvas"
                                                        style={{ textAlign: "center" }}
                                                        onClick={this.sendQr.bind(this)}>
                                                        <Grid item xs={12} style={{ justifyContent: "center", paddingTop: "2%" }}>
                                                            <QRCode value={JSON.stringify({ address: this.state.wallet.address, amount: this.state.amountSending })} />
                                                        </Grid>
                                                        <Grid item xs={12} style={{ justifyContent: "center" }}>
                                                            <Typography variant="caption">{this.props.language["detail-request-share-qr"]}</Typography>
                                                        </Grid>
                                                    </div>
                                                    : ""
                                            }
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Drawer>
                        <Drawer
                            anchor="bottom"
                            open={this.state.qrDrawer}
                            onClose={this.toggleQRDrawer(false)}
                        >
                            <Card elevation={0} square>
                                <CardContent>
                                    <Grid container alignItems="center" alignContent="center">
                                        {this.state.wallet.address !== "" ? <QRCode size={192} style={{ margin: "0 auto" }} value={JSON.stringify({ address: this.state.wallet.address })} /> : <CircularProgress />}
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

                        <Snackbar
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            open={this.state.refreshed}
                            onClose={this.handleClose}
                            TransitionComponent={Fade}
                            ContentProps={{ "aria-describedby": "message-id" }}
                            message={<span id="message-id">{this.props.language["help-refreshed"]}</span>}
                        />

                        <Dialog
                            open={this.state.askDelete}
                            onClose={this.handleClose}
                        >
                            <DialogTitle>{this.props.language["alert-delete-wallet"]}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {this.props.language["detail-delete-wallet"]}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={this.handleClose}
                                >
                                    {this.props.language["btn-cancel"]}
                                </Button>
                                <Button
                                    autoFocus
                                    variant="contained"
                                    style={{ backgroundColor: "#172349", color: "white" }}
                                    onClick={this.handleDelete}
                                >
                                    {this.props.language["btn-yes"]}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={this.state.openMnemonic}
                            onClose={this.closeMnemonic}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            classes={{ paper: this.props.classes.dialogPaper }}
                        >
                            <DialogTitle id="alert-dialog-title">{this.props.language["display-mnemonic"]}</DialogTitle>

                            {this.state.hasMnemonic ?
                                <DialogContent>
                                    {!this.state.passwordValidated ?
                                        <DialogContentText id="alert-dialog-description">
                                            {this.props.language["enter-password"]}
                                        </DialogContentText> :
                                        <DialogContentText id="alert-dialog-description">
                                            {this.props.language["your-mnemonic-is"]}
                                        </DialogContentText>
                                    }
                                    {!this.state.passwordValidated ?
                                        <TextField
                                            fullWidth
                                            id="adornment-password"
                                            error={this.state.passwordInvalid}
                                            label={this.props.language["ph-password"]}
                                            type={this.state.showPassword ? "text" : "password"}
                                            value={this.state.password}
                                            helperText={this.state.passwordInvalid ? this.props.language["alert-invalid-password"] : ""}
                                            style={{ fontSize: "1em" }}
                                            onChange={this.handleChangePassword()}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="Toggle password visibility"
                                                            onClick={this.handleClickShowPassword}
                                                            onMouseDown={this.handleMouseDownPassword}>
                                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }} /> :
                                        <DialogContentText id="alert-dialog-description" style={{ fontFamily: "monospace" }}>
                                            {this.state.mnemonic}
                                        </DialogContentText>
                                    }
                                </DialogContent>
                                :
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description" >
                                        {this.props.language["erase-recover-wallet"]}
                                    </DialogContentText>
                                </DialogContent>
                            }
                            {this.state.hasMnemonic ?
                                <DialogActions>
                                    {!this.state.passwordValidated ?
                                        <Button className={this.props.classes.btn} onClick={this.closeMnemonic}>
                                            {this.props.language["btn-close"]}
                                        </Button> : ""
                                    }
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: "#172349", color: "#fff" }}
                                        onClick={!this.state.passwordValidated ? this.validatePassword.bind(this) : this.closeMnemonic}
                                    >
                                        {this.state.passwordValidated ? this.props.language["btn-close"] : this.props.language["btn-submit"]}
                                    </Button>
                                </DialogActions> :
                                <DialogActions>
                                    <Button style={{ backgroundColor: "#172349", color: "#fff" }} onClick={this.closeMnemonic}>
                                        {this.props.language["btn-close"]}
                                    </Button>
                                </DialogActions>
                            }
                        </Dialog>

                        <Dialog fullScreen open={this.state.dialogMore} onClose={this.handleDialogMore} classes={{ paper: this.props.classes.dialogPaper }}>
                            <DialogTitle><Typography variant="h6">{this.state.name + this.props.language["title-wallet"] + " " + this.props.language["settings-title"]}</Typography></DialogTitle>
                            <DialogContent style={{ padding: 0, display: "flex", flexDirection: this.props.oneHanded ? "column-reverse" : "column" }}>
                                <List>
                                    <FeeSettings language={this.props.language} name={this.props.name}/>
                                    { this.props.oneHanded ? null : <Divider/> }
                                </List>
                            </DialogContent>
                            <DialogActions>
                                <Button className={this.props.classes.btn} onClick={this.handleDialogMore}>{this.props.language["btn-close"]}</Button>
                            </DialogActions>
                        </Dialog>
                    </PullToRefresh>
                    <AppBar position="fixed" className={this.props.classes.swipeArea}>
                    <Toolbar className={this.props.classes.bottomToolbar}>
                        <Grid item xs={4} justify="center">
                            <ButtonBase focusRipple aria-label="QR Code" disabled={this.props.name !== this.props.wallet.name} onClick={this.toggleQRDrawer(true)} className={this.props.classes.bottomToolbarBtn}>
                                <BlurOn style={{ color: this.props.paletteType === "light" ? "black" : "white" }}/>
                                <Typography variant="caption" align="center">{this.props.language["btn-qr"]}</Typography>
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={4} justify="center">
                            <ButtonBase focusRipple aria-label="Send HYC" disabled={this.props.name !== this.props.wallet.name} component={Link} {...{ to: "/sendcoins" } as any } onClick={this.props.handleDialog} className={this.props.classes.bottomToolbarBtn}>
                                <SendIcon style={{ color: this.props.paletteType === "light" ? "black" : "white" }}/>
                                <Typography variant="caption" align="center">{this.props.language["btn-send"]}</Typography>
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={4} justify="center">
                            <ButtonBase focusRipple aria-label="Receive HYC" disabled={this.props.name !== this.props.wallet.name} onClick={this.toggleReqDrawer(true)} className={this.props.classes.bottomToolbarBtn}>
                                <RequestIcon style={{ color: this.props.paletteType === "light" ? "black" : "white" }}/>
                                <Typography variant="caption" align="center">{this.props.language["btn-request"]}</Typography>
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={4} justify="center">
                            <ButtonBase focusRipple aria-label="More" disabled={this.props.name !== this.props.wallet.name} onClick={this.toggleMenu} className={this.props.classes.bottomToolbarBtn}>
                                <MoreIcon style={{ color: this.props.paletteType === "light" ? "black" : "white" }}/>
                                <Typography variant="caption" align="center">{this.props.language["btn-more"]}</Typography>
                            </ButtonBase>
                        </Grid>
                    </Toolbar>
                </AppBar>
                </div>
            </Grid >
        )
    }

    private handleDelete = () => {
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
        this.props.setWallets(true)
        this.props.handleWalletSelect(this.state.name)
    }

    private toggleMenu = (event: any) => {
        this.setState({ anchorEl: event.currentTarget })
    }

    private handleClose = () => {
        this.setState({ copied: false, refreshed: false, askDelete: false, anchorEl: null })
    }

    private toggleQRDrawer = (open: any) => () => {
        if (!this.state.reqDrawer) {
            this.setState({ qrDrawer: open })
        }
    }

    private toggleReqDrawer = (open: any) => () => {
        this.setState({ reqDrawer: open })
        if (!open) {
            this.setState({ amountSending: "" })
        }
        if (this.state.createQr) {
            this.setState({ createQr: open })
        }
    }

    private handleClick = () => {
        this.setState({ copied: true })
    }

    private handleTooltipClose = () => {
        this.setState({ tooltipOpen: false })
    }

    private handleTooltipOpen = () => {
        this.setState({ tooltipOpen: true })
    }

    private handleCollapse = () => {
        this.setState((state) => ({ collapse: !state.collapse }))
        storage.setItem("walletViewCollapse", (!this.state.collapse).toString())
    }

    private displayBalance(): string {
        console.log(this.state.wallet.balance)
        switch (this.balanceIndex) {
            case 0:
                return this.state.wallet.balance + " HYC"
            case 1:
                if (this.state.balance.fiat > 0.01 || Number(this.state.balance.fiat) === 0) {
                    return this.state.language["currency-symbol"] + this.state.balance.fiat.toFixed(2)
                } else {
                    return ">" + this.state.language["currency-symbol"] + 0.01
                }
            case 2:
                return "\u039E" + this.state.balance.eth
            case 3:
                return "\u0243" + this.state.balance.btc
            default:
                return this.state.hycBalance + " HYC"
        }
    }
    private switchBalance(selectIndex: number) {
        if (selectIndex !== -1) {
            this.balanceIndex = selectIndex
        } else if (this.balanceIndex === 3) {
            this.balanceIndex = 0
        } else { this.balanceIndex = this.balanceIndex + 1 }

        this.setState({ displayedBalance: this.displayBalance() })
    }

    private onRefresh() {
        this.setState({ refreshed: true })
        this.props.updateSelected(this.props.name)
        this.forceUpdate()
        this.switchBalance(0)
        return new Promise((resolve) => {
            setTimeout(resolve, 2000)
        })
    }

    private redirectGiftcard = () => {
        this.props.handleDialog(true)
    }

    private handleDialogMore = () => {
        this.setState({ anchorEl: false, dialogMore: !this.state.dialogMore })
    }

    private showMnemonic = () => {
        this.setState({ openMnemonic: true, anchorEl: false })
    }

    private closeMnemonic = () => {
        this.setState({ openMnemonic: false, passwordValidated: false, password: "", mnemonic: "" })
    }

    private validatePassword = () => {
        this.props.rest.getDecryptedMnemonic(this.state.name, this.state.password).then((data: string) => {
            if (data != null && data !== undefined && data !== "unable to decrypt data") {
                this.setState({ passwordValidated: true, mnemonic: data })
            } else if (data === "unable to decrypt data") {
                this.setState({ passwordInvalid: true })
            } else {
                alert(this.props.language["alert-error-show-mnemonic"])
            }
        }).catch((e) => { alert(this.props.language["alert-unknown-error-show-mnemonic"]) })
    }

    private handleClickShowPassword = () => {
        this.setState((state: any) => ({ showPassword: !this.state.showPassword }))
    }

    private handleMouseDownPassword = (event: any) => {
        event.preventDefault()
    }

    private testCompleted(index: number): boolean {
        const pendingSize = this.state.wallet.pendings.length
        if (pendingSize === 0) {
            return true
        } else if (index >= pendingSize) {
            return true
        } else {
            return false
        }
    }

    private getTransactionStyle(add: string): string {
        if (add !== this.state.address) {
            if (add === "H2BScrbeWW4JWXUyGEMAApRE8Y3SQHRYg") {
                return "GIFTCARD"
            } else {
                return "RECEIVE"
            }
        } else {
            return "SEND"
        }
    }

    private getDate(epoch: any): string {
        const d = new Date(epoch)
        let month = (d.getMonth() + 1).toString()
        let day = d.getDate().toString()
        if (month.length === 1) {
            month = "0" + month
        } else if (day.length === 1) {
            day = "0" + day
        }
        const str = d.getFullYear() + "/" + month + "/" + day + " " + d.toLocaleTimeString()
        return str
    }

    private sendQr() {
        html2canvas(document.getElementById("sendingCanvas")).then((canvas: any) => {
            window.plugins.socialsharing.shareViaEmail(
                "Requesting " + this.state.amountSending + "HYC to the address " + this.state.wallet.address,
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

    private handleChangePassword = () => (event: any) => {
        this.setState({ password: event.target.value })
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

export default withStyles(styles)(WalletView)
