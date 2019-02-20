import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import LinearProgress from "@material-ui/core/LinearProgress"
import TextField from "@material-ui/core/TextField"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import * as React from "react"
import { Link, Redirect } from "react-router-dom"
import { IRest } from "../rest"
import { IHyconWallet } from "../rest"
import { IGiftcard } from "../rest"
import ColorButton from "./component/ColorButton"
import NavBar from "./component/NavBar"
import { IText } from "./locales/m_locales"

// tslint:disable:no-var-requires
const gcLogoDark = require("./img/logo-full-dark.png")

// tslint:disable:object-literal-sort-keys
const styles = createStyles({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
    },
})

interface IGiftcardProps {
    rest: IRest
    language: IText
    wallet: IHyconWallet
    oneHanded: boolean
    handleDialog: (open: boolean) => void
}

export class Giftcard extends React.Component<IGiftcardProps, any> {

    public private
    constructor(props: IGiftcardProps) {
        super(props)
        this.state = {
            redirect: false,
            address: props.wallet.address,
            cardNumber: "",
            cardPIN: "",
            pending: false,
            errorCode: 0,
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
        if (this.state.redirect) {
            this.props.handleDialog(false)
        }

        let width = window.innerWidth * 0.9
        if (width > 400) { width = 400 }
        const height = width / 1.5858

        let title = ""
        if (this.props.oneHanded) {
            if (this.props.language.grammar === "reverse") {
                title = this.props.language["title-redeem-giftcard"].substring(3)
            } else {
                title = this.props.language["title-redeem-giftcard"].substring(0, 16)
            }
        } else if (this.props.language.grammar === "reverse") {
            title = this.props.wallet.name + this.props.language["title-wallet"] + this.props.language["title-redeem-giftcard"]
        } else {
            title = this.props.language["title-redeem-giftcard"] + this.props.wallet.name + this.props.language["title-wallet"]
        }

        return (
            <Grid style={styles.root}>
                <Grid justify="space-between" style={styles.root}>
                    <Grid item>
                        {this.state.pending ? <Grid item xs={12}><LinearProgress /></Grid> : null}
                        <NavBar handleDialog={this.props.handleDialog} oneHanded={this.props.oneHanded} title={title} />
                    </Grid>

                    <Grid item alignContent="center">
                        <Card elevation={2} style={{ height, width, margin: "0 auto", borderRadius: 8, backgroundColor: "#eceff1" }}>
                            <CardContent style={{ paddingBottom: 16, height: "100%" }}>
                                <Grid container direction="column" justify="space-between" spacing={16} style={{ height: "100%" }}>
                                    <Grid item>
                                        <Typography align="left" style={{ color: "black" }}>HYCON GIFT CARD</Typography>
                                    </Grid>
                                    <Grid item style={{ textAlign: "center" }}>
                                        <img style={{ margin: "0 auto", maxHeight: 70 }} src={gcLogoDark} />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            error={this.handleStatus("card") !== ""}
                                            helperText={this.handleStatus("card")}
                                            type="number"
                                            id="cardNumber"
                                            label={this.props.language["gc-number"]}
                                            placeholder="0000 - 0000 - 0000 - 0000"
                                            fullWidth
                                            value={this.state.cardNumber}
                                            onChange={this.handleInputChange("cardNumber")}
                                            InputLabelProps={{ shrink: true, style: { color: "black" } }}
                                            inputProps={{ style: { textAlign: "center", color: "black" } }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Grid item xs={12}>
                            <Grid item style={{ margin: "5% 20%" }}>
                                <TextField
                                    error={this.handleStatus("pin") !== ""}
                                    helperText={this.handleStatus("pin")}
                                    id="cardPIN"
                                    label={this.props.language["gc-pin"]}
                                    placeholder={this.props.language["gc-pin-placeholder"]}
                                    variant="outlined"
                                    fullWidth
                                    value={this.state.cardPIN}
                                    onChange={this.handleInputChange("cardPIN")}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ maxLength: 8, style: { textAlign: "center" } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item alignContent="center" style={{ margin: "8px 16px" }}>
                        <ColorButton
                            fullWidth
                            size="large"
                            onClick={this.registerGiftcard.bind(this)}>
                            {this.props.language["btn-redeem"]}
                        </ColorButton>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    private handleStatus(label: string): string {
        if (label === "card") {
            switch (this.state.errorCode) {
                case 1:
                    return this.state.cardNumber === "" ? this.props.language["alert-gc-enter-cardnumber"] : ""
                case 2:
                    return this.props.language["alert-gc-enter-16-digit"]
                default:
                    return ""
            }
        } else if (label === "pin") {
            switch (this.state.errorCode) {
                case 1:
                    return this.state.cardPIN === "" ? this.props.language["alert-gc-enter-pin"] : ""
                default:
                    return ""
            }
        }

    }
    private handleInputChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
    }

    private async registerGiftcard() {
        const trimedCardNumber = this.state.cardNumber.replace("-", "")
        let data: IGiftcard

        if (!trimedCardNumber || !this.state.cardPIN) {
            this.setState({ errorCode: 1 })
            return
        } else if (trimedCardNumber.length !== 16) {
            this.setState({ errorCode: 2 })
            return
        } else {
            data = {
                cardNumber: trimedCardNumber,
                cardPIN: this.state.cardPIN,
                address: this.state.address,
            }
        }

        this.setState({ pending: true })
        const status = await this.props.rest.registerGiftcard(data)
        if (!status) {
            console.error("Could not connect to https://wallet.hycon.io")
            alert(this.props.language["alert-gc-internal-server-error"])
        } else if (typeof status === "number") {
            switch (status) {
                case 200:
                    alert(this.props.language["alert-gc-redeemed"])
                    this.setState({ redirect: true })
                    break
                case 300:
                    alert(this.props.language["alert-gc-invalid-info"])
                    break
                case 301:
                    alert(this.props.language["alert-gc-already-redeemed"])
                    break
                default:
                    alert(this.props.language["alert-gc-internal-server-error"])
            }
        }
        this.setState({ pending: false })
    }
}
