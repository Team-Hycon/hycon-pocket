import { createStyles, FormControl } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Collapse from "@material-ui/core/Collapse"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import InputLabel from "@material-ui/core/InputLabel"
import Paper from "@material-ui/core/Paper"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
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

export class ClaimWallet extends React.Component<IProps, any> {
    public static getDerivedStateFromProps(nextProps: IProps, previousState: any): IProps {
        return Object.assign(nextProps, {})
    }

    constructor(props: IProps) {
        super(props)
        this.state = {
            email: "",
            password: "",
            pin: "",
            showPassword: false,
            showTFA: true,
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
                                    Claim Wallet
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid item alignContent="center">
                        <Grid item style={{ width: "60%", margin: "0 auto" }}>
                            <div style={{ paddingBottom: "10%" }}>
                                <Input
                                    fullWidth
                                    id="email"
                                    type="text"
                                    placeholder="Email"
                                    value={this.state.email}
                                    style={{ fontSize: "1em" }}
                                    onChange={this.handleChange("email")}
                                />
                            </div>
                            <div>
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
                            </div>
                            <div style={{ display: "flex" }}>
                                <Collapse in={this.state.showTFA} style={{ width: "100%" }}>
                                    <Paper elevation={4}>
                                        <Input
                                            fullWidth
                                            disableUnderline
                                            id="pin"
                                            type="number"
                                            placeholder="2FA PIN"
                                            value={this.state.pin}
                                            inputProps={{
                                                style: { textAlign: "center" },
                                                maxLength: 6,
                                            }}
                                            style={{ padding: "15px 0", fontSize: "1em" }}
                                            onChange={this.handleChange("pin")}
                                        />
                                    </Paper>
                                </Collapse>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item alignContent="center">
                        <Button
                            style={{ backgroundColor: "#2196f3", color: "#fff", width: "100%", padding: "16px 24px" }}>
                            LOG IN
                        </Button>
                    </Grid>
                </Grid>
            </div >
        )
    }

    private handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value })
    }

    private handleMouseDownPassword = (event: any) => {
        event.preventDefault()
    }

    private handleClickShowPassword = () => {
        this.setState((state: any) => ({ showPassword: !this.state.showPassword }))
    }

    private showTFA = () => {
        this.setState((state: any) => ({ showTFA: !state.checked }))
    }

}
