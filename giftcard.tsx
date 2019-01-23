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
import { IText } from "./locales/m_locales"

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
        }
    }

    public render() {
        if (this.state.redirect) {
            return <Redirect to={"/wallet/" + this.props.wallet.name} />
        }

        return (
            <Grid container justify="space-between" style={styles.root}>
                <Grid item>
                    {this.state.pending ? <Grid item xs={12}><LinearProgress /></Grid> : null}
                    <AppBar style={{ background: "transparent", boxShadow: "none", zIndex: 0 }} position="static">
                        <Toolbar style={styles.header}>
                            <Link to={"/wallet/" + this.props.wallet.name}>
                                <IconButton><ArrowBackIcon /></IconButton>
                            </Link>
                                <Typography variant="button" align="center">
                                    {this.props.language.grammar === "reverse"
                                        ? this.props.wallet.name + this.props.language["title-wallet"] + this.props.language["title-redeem-giftcard"]
                                        : this.props.language["title-redeem-giftcard"] + this.props.wallet.name + this.props.language["title-wallet"]}
                                </Typography>
                            <div style={{ width: 48, height: 48 }} />
                        </Toolbar>
                    </AppBar>
                    <Divider />
                </Grid>

                <Grid item alignContent="center">
                    <Card elevation={0} square>
                        <CardContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <TextField
                                        type="number"
                                        id="cardNumber"
                                        label={this.props.language["gc-number"]}
                                        placeholder="0000 - 0000 - 0000 - 0000"
                                        variant="outlined"
                                        fullWidth
                                        value={this.state.cardNumber}
                                        onChange={this.handleInputChange("cardNumber")}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="cardPIN"
                                        label={this.props.language["gc-pin"]}
                                        placeholder={this.props.language["gc-pin-placeholder"]}
                                        variant="outlined"
                                        fullWidth
                                        value={this.state.cardPIN}
                                        onChange={this.handleInputChange("cardPIN")}
                                        inputProps={{ maxLength: 8 }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item alignContent="center">
                    <Button
                        fullWidth
                        disabled={this.state.pending}
                        onClick={this.registerGiftcard.bind(this)}
                        style={{ backgroundColor: "#172349", color: "#fff", padding: "16px 24px" }}>
                        등록
                    </Button>
                </Grid>
            </Grid>
        )
    }

    private handleInputChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
    }

    private async registerGiftcard() {
        const trimedCardNumber = this.state.cardNumber.replace("-", "")
        let data: IGiftcard

        if (!trimedCardNumber) {
            alert(this.props.language["alert-gc-enter-cardnumber"])
            return
        } else if (trimedCardNumber.length !== 16) {
            alert(this.props.language["alert-gc-enter-16-digit"])
            return
        } else if (!this.state.cardPIN) {
            alert(this.props.language["alert-gc-enter-pin"])
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
