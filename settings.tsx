import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Dialog, { DialogProps } from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import InfoIcon from "@material-ui/icons/Info"
import * as React from "react"
import NavBar from "./component/NavBar"
import { ChangelogContent } from "./content/changelog"
import { FeeSettings } from "./content/feeSettings"
import { FingerprintContent } from "./content/fingerprint"
import { PrivacyPolicyContent } from "./content/privacyPolicy"
import { TermsOfUseContent } from "./content/termsOfUse"
import { IText } from "./locales/m_locales"

// CHECK VERSION EVERYTIME BEFORE RELEASING
const VERSION = "2.0.0"
const storage = window.localStorage
declare let window: any

const styles = (theme: Theme) => createStyles({
    btn: {
        color: theme.palette.type === "dark" ? "white" : "#172349",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
    },
    listSubheader: {
        margin: "auto 16px",
    },
    root: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
})

interface ISettingsProps extends WithStyles<typeof styles> {
    language: IText
    handleDialog: (open: boolean) => void
    handleOneHanded: () => void
    oneHanded: boolean
    showBalance: boolean
    showBalanceToggler: () => void
}

class Settings extends React.Component<ISettingsProps, any> {
    public  scrollTop = 0

    constructor(props: ISettingsProps) {
        super(props)
        this.state = {
            dialogFingerprint: false,
            dialogPrivacyPolicy: false,
            dialogTermsOfUse: false,
            dialogWhatsNew: false,
            fingerprintEnabled: storage.getItem("fingerprint") === null ? false : (storage.getItem("fingerprint") === "true"),
            globalFee: JSON.parse(storage.getItem("globalFee")) ? (JSON.parse(storage.getItem("globalFee")).active === "true") : false,
            miningFee: JSON.parse(storage.getItem("globalFee")) ? JSON.parse(storage.getItem("globalFee")).value : "1",
            showBalance: storage.getItem("showBalance") === null ? true : (storage.getItem("showBalance") === "true"),
        }
    }

    public componentDidMount() {
        document.addEventListener("backbutton", (event) => {
            event.preventDefault()
            this.props.handleDialog(false)
            window.location.hash = "#/"
            return
        }, false)
    }

    public componentWillUnmount() {
        document.removeEventListener("backbutton", (event) => {
            event.preventDefault()
            this.props.handleDialog(false)
            window.location.hash = "#/"
            return
        }, false)
    }

    public render() {
        return (
            <Grid className={this.props.classes.root}>
                <NavBar handleDialog={this.props.handleDialog} oneHanded={this.props.oneHanded} title={this.props.language["settings-title"]}/>
                {this.renderListSettings()}
            </Grid>
        )
    }

    public renderListSettings() {
        return (
            <Grid>
                {/* General Settings */}
                <List
                    subheader={
                        <ListSubheader disableSticky color="primary" component="div" className={this.props.classes.header}>
                            <span className={this.props.classes.listSubheader}>{this.props.language["settings-general"]}</span>
                        </ListSubheader>
                    }
                >
                    <ListItem button onClick={this.props.showBalanceToggler} key="item-show-balance">
                        <ListItemText primary={this.props.showBalance ? this.props.language["hide-balance"] : this.props.language["show-balance"]} />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={this.props.handleOneHanded} key="item-one-handed">
                        <ListItemText primary={this.props.oneHanded ? "Turn off one-handed mode" : "Turn on one-handed mode"} />
                    </ListItem>
                    <Divider />
                    <FeeSettings language={this.props.language} name={""} />
                    <Divider />
                </List><br />

                {/* Security */}
                <List
                    subheader={
                        <ListSubheader disableSticky color="primary" component="div" className={this.props.classes.header}>
                            <span className={this.props.classes.listSubheader}>Security</span>
                        </ListSubheader>
                    }
                >
                    <ListItem button onClick={this.handleDialogFingerprint} key="item-fingerprint">
                        <ListItemText primary="Require fingerprint on app launch" secondary={this.state.fingerprintEnabled ? "Enabled" : "Disabled" }/>
                    </ListItem>
                    <Dialog fullScreen open={this.state.dialogFingerprint} onClose={this.handleDialogFingerprint} scroll={this.state.scroll}>
                        <DialogTitle><Typography variant="h6">Fingerprint on app launch</Typography></DialogTitle>
                        <FingerprintContent language={this.props.language} />
                        <DialogActions>
                            <Button className={this.props.classes.btn} onClick={this.handleDialogFingerprint}>{this.props.language["btn-close"]}</Button>
                            <Button className={this.props.classes.btn} onClick={this.handleFingerprintSettings}>{this.state.fingerprintEnabled ? "Disable" : "Enable"}</Button>
                        </DialogActions>
                    </Dialog>
                    <Divider />
                </List><br />

                {/* Support */}
                <List
                    subheader={
                        <ListSubheader disableSticky color="primary" component="div" className={this.props.classes.header}>
                            <span className={this.props.classes.listSubheader}>{this.props.language["settings-support"]}</span>
                        </ListSubheader>
                    }
                >
                    <ListItem button onClick={this.handleSendFeedback} key="item-inquiry">
                        <ListItemText primary={this.props.language["settings-feedback"]} />
                    </ListItem>
                    <Divider />
                </List><br />

                {/* About */}
                <List
                    subheader={
                        <ListSubheader disableSticky color="primary" component="div" className={this.props.classes.header}>
                            <span className={this.props.classes.listSubheader}>{this.props.language["settings-about"]}</span>
                        </ListSubheader>
                    }
                >
                    <ListItem button onClick={this.handleDialogTermsOfUse} key="item-terms-of-use">
                        <ListItemText primary={this.props.language["terms-of-use"]} />
                    </ListItem>
                    <Dialog fullScreen open={this.state.dialogTermsOfUse} onClose={this.handleDialogTermsOfUse} scroll={this.state.scroll}>
                        <DialogTitle><Typography variant="h6">{this.props.language["terms-of-use"]}</Typography></DialogTitle>
                        <TermsOfUseContent language={this.props.language} />
                        <DialogActions>
                            <Button className={this.props.classes.btn} onClick={this.handleDialogTermsOfUse}>{this.props.language["btn-close"]}</Button>
                        </DialogActions>
                    </Dialog>
                    <Divider />

                    <ListItem button onClick={this.handleDialogPrivacyPolicy} key="item-privacy-policy">
                        <ListItemText primary={this.props.language["privacy-policy"]} />
                    </ListItem>
                    <Dialog fullScreen open={this.state.dialogPrivacyPolicy} onClose={this.handleDialogPrivacyPolicy} scroll={this.state.scroll}>
                        <DialogTitle><Typography variant="h6">{this.props.language["privacy-policy"]}</Typography></DialogTitle>
                        <PrivacyPolicyContent language={this.props.language} />
                        <DialogActions>
                            <Button className={this.props.classes.btn} onClick={this.handleDialogPrivacyPolicy}>{this.props.language["btn-close"]}</Button>
                        </DialogActions>
                    </Dialog>
                    <Divider />

                    <ListItem button onClick={this.handleDialogChangelog} key="item-app-version">
                        <ListItemText primary={this.props.language["settings-app-version"]} secondary={VERSION} />
                        {storage.getItem("seenChangelog") !== VERSION ?
                            <ListItemSecondaryAction>
                                <IconButton disableRipple onClick={this.handleDialogChangelog} aria-label="Info">
                                    <InfoIcon style={{ color: "#2195a0" }} />
                                </IconButton>
                            </ListItemSecondaryAction> : ""
                        }
                    </ListItem>
                    <Dialog fullScreen open={this.state.dialogWhatsNew} onClose={this.handleDialogChangelog} scroll={this.state.scroll}>
                        <DialogTitle><Typography variant="h6">{this.props.language["changelog-whats-new"]}</Typography></DialogTitle>
                        <ChangelogContent language={this.props.language} />
                        <DialogActions>
                            <Button className={this.props.classes.btn} onClick={this.handleDialogChangelog}>{this.props.language["btn-close"]}</Button>
                        </DialogActions>
                    </Dialog>
                    <Divider />

                    <ListItem key="item-copyright">
                        <ListItemText primary={this.props.language["settings-copyright"]} secondary={this.props.language["settings-copyright-hycon"]} />
                    </ListItem>
                    <Divider />
                </List><br />
            </Grid>
        )
    }

    private handleFingerprintSettings = () => {
        if (this.state.fingerprintEnabled) {
            this.setState({ fingerprintEnabled: false, dialogFingerprint: false })
            storage.setItem("fingerprint", "false")
        } else {
            window.Fingerprint.isAvailable((sucess) => {
                window.Fingerprint.show({
                    clientId: "Hycon Pocket",
                    clientSecret: "2.0.0",
                }, () => {
                    storage.setItem("fingerprint", "true")
                    this.setState({ fingerprintEnabled : true, dialogFingerprint: false })
                }, (err) => {
                    storage.setItem("fingerprint", "false")
                    this.setState({ fingerprintEnabled: false, dialogFingerprint: false })
                })
            })
        }
    }
    private handleDialogFingerprint = () => {
        this.setState({ dialogFingerprint: !this.state.dialogFingerprint })
    }
    private handleDialogTermsOfUse = () => {
        this.setState({ dialogTermsOfUse: !this.state.dialogTermsOfUse })
    }

    private handleDialogPrivacyPolicy = () => {
        this.setState({ dialogPrivacyPolicy: !this.state.dialogPrivacyPolicy })
    }

    private handleDialogChangelog = () => {
        this.setState({ dialogWhatsNew: !this.state.dialogWhatsNew })
        storage.setItem("seenChangelog", VERSION)
    }

    private handleSendFeedback = () => {
        window.plugins.socialsharing.shareViaEmail(
            "\n\n\n\n\n\n" + window.navigator.appVersion,
            this.props.language["settings-feedback"],
            ["support@hycon.io"],
            null,
            null,
            null,
            (result) => { },
            (msg) => { },
        )
    }
}

export default withStyles(styles)(Settings)
