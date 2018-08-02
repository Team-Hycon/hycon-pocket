import { createStyles, Fade, FormControl } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Collapse from "@material-ui/core/Collapse"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import InputLabel from "@material-ui/core/InputLabel"
import MobileStepper from "@material-ui/core/MobileStepper"
import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import HelpIcon from "@material-ui/icons/Help"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { animated, Transition } from "react-spring"
import { getLocale, IText } from "../locales/locales"
import { IRest } from "../rest"

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
// tslint:disable-next-line:no-empty-interface
interface IState {

}
export class AddWallet extends React.Component<IProps, any> {

    public static getDerivedStateFromProps(nextProps: IProps, previousState: IState): IState & IProps {
        return Object.assign(nextProps, {
        })
    }

    constructor(props: IProps) {
        super(props)
        this.state = {
            alertDialogShown: false,
            language: "en",
            walletName: "",
            password: "",
            confirmPassword: "",
            checked: false,
            passphrase: "",
            step: 0,
            generatedMnemonic: "",
            confirmMnemonic: "",
            reconfirmMnemonic: "",
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public renderWalletInfo() {
        return (
            <Grid item style={{ width: "60%", margin: "0 auto" }}>
                <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                    <Input
                        fullWidth
                        id="wallet_name"
                        type="text"
                        placeholder="Wallet Name"
                        value={this.state.email}
                        style={{ fontSize: "1em" }}
                        onChange={this.handleChange("walletName")}
                    />
                </Grid>
                <Grid container direction="row" spacing={8}>
                    <Grid item xs={12} sm={6}>
                        <Input
                            fullWidth
                            id="adornment-password"
                            type={this.state.showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={this.state.password}
                            style={{ fontSize: "1em" }}
                            onChange={this.handleChange("password")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                        onMouseDown={this.handleMouseDownPassword}
                                    >
                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            fullWidth
                            id="confirm-password"
                            type={this.state.showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={this.state.confirmPassword}
                            style={{ fontSize: "1em" }}
                            onChange={this.handleChange("confirmPassword")}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checked}
                                onChange={this.handleAdvancedOption("checked")}
                                value="checked"
                                color="primary"
                            />
                        }
                        style={{ fontSize: "1em" }}
                        label="Advanced Options"
                    />
                    <IconButton onClick={this.onClickHint.bind(this)}>
                        <HelpIcon style={{ fontSize: "18px" }} />
                    </IconButton>
                </Grid>
                <Grid item xs={12} style={{ display: "flex" }}>
                    <Collapse in={this.state.checked} style={{ width: "100%" }}>
                        <Input
                            fullWidth
                            id="bip39-passphrase"
                            type="text"
                            placeholder="BIP39 Passphrase"
                            value={this.state.passphrase}
                            style={{ fontSize: "0.7em" }}
                            onChange={this.handleChange("passphrase")}
                        />
                    </Collapse>
                </Grid>
            </Grid>
        )
    }

    public renderMnemonic() {
        return (
            <Grid item style={{ width: "90%", margin: "0 auto" }}>
                <Typography align="left" style={{ fontSize: "1.2em", paddingBottom: "10%" }}>
                    Please type the mnemonic above. Write down your mnemonic on a piece of paper and keep it somewhere safe. You will need your mnemonic phrase to recover your wallet.
                </Typography>
                <Input
                    id="generated-mnemonic"
                    fullWidth
                    multiline
                    disableUnderline
                    disabled
                    rowsMax="2"
                    value="check moral submit print museum couple ghost source solution armor evolve actual"
                    style={{ paddingBottom: "10%" }}
                />
                <Input
                    id="confirm-mnemonic"
                    fullWidth
                    multiline
                    rowsMax="2"
                    placeholder="Enter the above mnemonic"
                    value={this.state.confirmMnemonic}
                    onChange={this.handleChange("confirmMnemonic")}
                />
            </Grid>
        )
    }

    public renderConfirm() {
        return (
            <Grid item style={{ width: "70%", margin: "0 auto" }}>
                <Typography align="left" style={{ fontSize: "1.2em", paddingBottom: "10%" }}>
                    Please retype the mnemonic from the previous screen.
                </Typography>
                <Input
                    id="reconfirm-mnemonic"
                    fullWidth
                    multiline
                    rowsMax="2"
                    placeholder="Enter the mnemonic from the previous screen"
                    value={this.state.reconfirmMnemonic}
                    onChange={this.handleChange("reconfirmMnemonic")}
                />
            </Grid>
        )
    }

    public render() {
        let component: any
        switch (this.state.step) {
            case 0:
                component = this.renderWalletInfo()
                break
            case  1:
                component = this.renderMnemonic()
                break
            case 2:
                component = this.renderConfirm()
                break
        }
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
                                    Add Wallet
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid item alignContent="center">
                        {component}
                    </Grid>
                    <Grid item alignContent="center">
                        {this.state.step < 2 ?
                            <Button
                                onClick={this.incrementStep.bind(this)}
                                style={{ backgroundColor: "#2196f3", color: "#fff", width: "100%", padding: "16px 24px" }}>
                                CONTINUE
                            </Button> :
                            <Link to="/">
                                <Button
                                    style={{ backgroundColor: "#2196f3", color: "#fff", width: "100%", padding: "16px 24px" }}>
                                    FINISH
                                </Button>
                            </Link>
                        }
                    </Grid>
                </Grid>
                <Modal aria-labelledby="passphrase-hint" open={this.state.alertDialogShown} onClose={this.hideAlertDialog.bind(this)}>
                    <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute" }}>
                        <Paper style={{ padding: 10 }}>
                            <Typography gutterBottom align="center">
                                Used with your Mnemonic Phrase to recover your Hycon Wallet to manage your wallet more securely.
                            </Typography>
                            <Typography align="center">
                                Do not lose BIP39 Passphrase. You will not be able to recover your wallet without it.
                            </Typography>
                        </Paper>
                    </div>
                </Modal>
            </div >
        )
    }

    private incrementStep() {
        const i = this.state.step + 1
        this.setState({ step: i })
    }

    private onClickHint() {
        this.setState({ alertDialogShown: true })
    }
    private hideAlertDialog() {
        this.setState({ alertDialogShown: false })
    }

    private handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
    }

    private handleAdvancedOption = (name: any) => (event: any) => {
        this.setState({ [name]: event.target.checked })
    }
    private handleMouseDownPassword = (event: any) => {
        event.preventDefault()
    }

    private handleClickShowPassword = () => {
        this.setState((state: any) => ({ showPassword: !this.state.showPassword }))
    }

    private editSelects(event: any) {
        this.setState({ modifier: event.target.value })
    }

    private generateWallet() {
        console.log("isMnemonic function update" + this.state.isMnemonic)
        this.setState({ isMnemonic: true })
    }
}
