import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import createStyles from "@material-ui/core/styles/createStyles"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import SwipeableViews from "react-swipeable-views"
import { IRest } from "../../rest"
import { AddWallet } from "../addWallet"
import { IText } from "../locales/m_locales"
import { TermsOfUseContent } from "./termsOfUse"

// tslint:disable:no-var-requires
const logoBallW = require("../img/hycon-logo-ball-w.png")
const lock = require("../img/onboarding-lock.png")
const graph = require("../img/onboarding-graph.png")
const qr = require("../img/onboarding-qr.png")
const storage = window.localStorage
const tempStorage = window.sessionStorage

const styles = (theme: Theme) => createStyles({
    nestedContent: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
})

interface IProps extends WithStyles<typeof styles> {
    rest: IRest,
    language: IText,
    closeOnboarding: () => void,
    handleWalletSelect: () => void,
    setWallets: (fromDelete?: boolean) => void,
}

export class Onboarding extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            activeStep: tempStorage.getItem("activeStep") === null ? 0 : Number(tempStorage.getItem("activeStep")) + 1,
            hasWallet: false,
            openCreateWalletDialog: false,
            openDialog: false,
            recoverWithPhrase: false,
            scroll: "paper",
            secureOnDevice: false,
            termsOfUse: false,
        }

        this.props.rest.getWalletList().then((data: any) => {
            if (data.walletList.length > 0) {
                this.setState({ activeStep: this.state.activeStep + 1, hasWallet: true })
            }
        })
    }

    public render() {
        const onboardingSlides = [
            {
                label: "1",
                slide: (
                    <Grid container alignItems="center" style={{ margin: "0 20%" }}>
                        <Grid item xs={12}>
                            <Typography variant="caption" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step1-text1"]}</Typography>
                            <Grid item style={{ marginTop: "15%", textAlign: "center" }}><img style={{ maxHeight: 70 }} src={logoBallW} /></Grid>
                            <Typography variant="subtitle2" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step1-text2"]}</Typography>
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12}>
                            <Typography variant="body2" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step1-text3"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" style={{ background: "#172349", color: "white", textTransform: "none" }} onClick={this.handleNext}>{this.props.language["btn-get-started"]}</Button>
                        </Grid>
                    </Grid >
                ),
            }, {
                label: "2",
                slide: (
                    <Grid container alignItems="center" style={{ margin: "0 20%" }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step2-text1"]}</Typography>
                            <Typography variant="caption" align="center" style={{ color: "#172349" }}>{this.props.language["onboarding-step2-text2"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item style={{ textAlign: "center" }}>
                                {Number(window.orientation) % 180 === 0 ? <img style={{ maxHeight: 180 }} src={qr} /> : <img style={{ maxHeight: 120 }} src={qr} />}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step2-text3"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" style={{ background: "#172349", color: "white", textTransform: "none" }} onClick={this.handleNext}>{this.props.language["btn-got-it"]}</Button>
                        </Grid>
                    </Grid >
                ),
            }, {
                label: "3",
                slide: (
                    <Grid container alignItems="center" style={{ margin: "0 20%" }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step3-text1"]}</Typography>
                            <Typography variant="caption" align="center" style={{ color: "#172349" }}>{this.props.language["onboarding-step3-text2"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item style={{ textAlign: "center" }}>
                                {Number(window.orientation) % 180 === 0 ? <img style={{ maxHeight: 180 }} src={graph} /> : <img style={{ maxHeight: 120 }} src={graph} />}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step3-text3"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" style={{ background: "#172349", color: "white", textTransform: "none" }} onClick={this.handleNext}>{this.props.language["btn-got-it"]}</Button>
                        </Grid>
                    </Grid >
                ),
            }, {
                label: "4",
                slide: (
                    <Grid container alignItems="center" style={{ margin: "0 20%" }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step4-text1"]}</Typography>
                            <Typography variant="caption" align="center" style={{ color: "#172349" }}>{this.props.language["onboarding-step4-text2"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item style={{ textAlign: "center" }}>
                                {Number(window.orientation) % 180 === 0 ? <img style={{ maxHeight: 180 }} src={lock} /> : <img style={{ maxHeight: 120 }} src={lock} />}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step4-text3"]}</Typography>
                        </Grid>
                        {this.state.hasWallet ?
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" style={{ background: "#172349", color: "white", textTransform: "none" }} onClick={this.handleNext}>{this.props.language["btn-got-it"]}</Button>
                            </Grid> :
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" style={{ background: "#172349", color: "white", textTransform: "none" }} onClick={this.handleAddWalletDialog}>{this.props.language["btn-create-now"]}</Button>
                                <Button fullWidth style={{ color: "white", textTransform: "none" }} onClick={this.handleNext}>{this.props.language["btn-create-later"]}</Button>
                            </Grid>
                        }
                        <Dialog fullScreen open={this.state.openCreateWalletDialog} scroll={this.state.scroll}>
                            <AddWallet rest={this.props.rest} language={this.props.language} handleDialog={this.handleAddWalletDialog} setWallets={this.props.setWallets.bind(this)} handleWalletSelect={this.props.handleWalletSelect.bind(this)}/>
                        </Dialog>
                    </Grid >
                ),
            }, {
                label: "5",
                slide: (
                    <Grid container alignItems="center">
                        <Grid item xs={12} style={{ margin: "0 20%" }}>
                            <Typography variant="subtitle1" align="center" style={{ color: "white" }}>{this.props.language["onboarding-step5-text1"]}</Typography>
                            <Typography variant="caption" align="center" style={{ color: "#172349" }}>{this.props.language["onboarding-step5-text2"]}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <List>
                                <ListItem key={1} disableRipple button>
                                    <Checkbox disableRipple checked={this.state.secureOnDevice} onChange={this.handleCheckbox("secureOnDevice")} value="secureOnDevice" style={{ color: "white" }} />
                                    <ListItemText disableTypography
                                        primary={<Typography variant="caption" style={{ color: "white" }}>
                                            {this.props.language["onboarding-step5-checkbox1"]}
                                        </Typography>}
                                    />
                                </ListItem>
                                <ListItem key={2} disableRipple button>
                                    <Checkbox disableRipple checked={this.state.recoverWithPhrase} onChange={this.handleCheckbox("recoverWithPhrase")} value="recoverWithPhrase" style={{ color: "white" }} />
                                    <ListItemText disableTypography
                                        primary={<Typography variant="caption" style={{ color: "white" }}>
                                            {this.props.language["onboarding-step5-checkbox2"]}
                                        </Typography>}
                                    />
                                </ListItem>
                                <ListItem key={3} disableRipple button>
                                    <Checkbox disableRipple checked={this.state.termsOfUse} onChange={this.handleCheckbox("termsOfUse")} value="termsOfUse" style={{ color: "white" }} />
                                    <ListItemText disableTypography
                                        primary={<Typography variant="caption" style={{ color: "white" }}>
                                            {this.props.language["onboarding-step5-checkbox3"]} <a onClick={() => this.handleDialog} style={{ color: "#0095a2", textDecoration: "underline" }}>{this.props.language["terms-of-use"]}</a>
                                        </Typography>}
                                    />
                                </ListItem>
                                <ListItem key={4} disableRipple button onClick={this.handleCheckbox("all")}>
                                    <ListItemText disableTypography
                                        primary={<Typography align="right" variant="caption" style={{ color: "white" }}>{this.props.language["check-all"]}</Typography>}
                                    />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            disableRipple
                                            checked={[this.state.secureOnDevice, this.state.recoverWithPhrase, this.state.termsOfUse].filter((v) => (v)).length === 3}
                                            onChange={this.handleCheckbox("all")}
                                            value="checkAll"
                                            style={{ color: "white" }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                        <Grid item xs={12} style={{ margin: "0 20%" }}>
                            {[this.state.secureOnDevice, this.state.recoverWithPhrase, this.state.termsOfUse].filter((v) => (v)).length !== 3 ?
                                <Button fullWidth variant="contained" disabled style={{ textTransform: "none" }}
                                >{this.props.language["btn-finish"]}</Button> :
                                <Button fullWidth variant="contained" style={{ background: "#172349", color: "white", textTransform: "none" }} onClick={this.handleFinish.bind(this)}
                                >{this.props.language["btn-finish"]}</Button>
                            }
                        </Grid>
                    </Grid>
                ),
            },
        ]

        const maxSteps = onboardingSlides.length
        return (
            <Grid item xs={12} className={this.props.classes.nestedContent}>
                <SwipeableViews
                    axis={"x"}
                    index={this.state.activeStep}
                    onChangeIndex={this.handleStepChange}
                    style={{ flex: 1, display: "flex", flexDirection: "column", background: "-webkit-linear-gradient(top, #0095a1 0%,#172349 100%)" }}
                    containerStyle={{ flex: 1, display: "flex" }}
                >
                    {onboardingSlides.map((step, index) => (
                        <Grid container key={step.label} style={{ height: "100%" }}>
                            {step.slide}
                        </Grid>
                    ))}
                </SwipeableViews>
                <Dialog open={this.state.openDialog} onClose={() => this.handleDialog} scroll={this.state.scroll}>
                    <DialogTitle id="terms-of-use-title"><Typography variant="h6">{this.props.language["terms-of-use"]}</Typography></DialogTitle>
                    <TermsOfUseContent language={this.props.language} />
                    <DialogActions>
                        <Button style={{ color: "#172349" }} onClick={() => this.handleDialog}>{this.props.language["btn-close"]}</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        )
    }

    private handleCheckbox = (name) => (event) => {
        if (name === "all" && ([this.state.secureOnDevice, this.state.recoverWithPhrase, this.state.termsOfUse].filter((v) => (v)).length < 3)) {
            this.setState({ secureOnDevice: true, recoverWithPhrase: true, termsOfUse: true })
        } else if ([this.state.secureOnDevice, this.state.recoverWithPhrase, this.state.termsOfUse].filter((v) => (v)).length === 3) {
            this.setState({ secureOnDevice: false, recoverWithPhrase: false, termsOfUse: false })
        } else {
            this.setState({ [name]: event.target.checked })
        }
    }

    private handleDialog = (open?: boolean) => {
        this.setState({ openDialog: !this.state.openDialog })
    }

    private handleAddWalletDialog = () => {
        if (this.state.openCreateWalletDialog) { this.handleNext() }
        this.setState({ openCreateWalletDialog: !this.state.openCreateWalletDialog })
    }

    private handleFinish = () => {
        storage.setItem("onboarding", "true")
        this.props.closeOnboarding()
    }

    private handleNext = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep + 1,
        }))
        tempStorage.setItem("activeStep", this.state.activeStep.toString())
    }

    private handleStepChange = (activeStep) => {
        this.setState({ activeStep })
        tempStorage.setItem("activeStep", this.state.activeStep.toString())
    }
}

export default withStyles(styles)(Onboarding)
