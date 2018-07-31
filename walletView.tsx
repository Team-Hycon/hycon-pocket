import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Fade from "@material-ui/core/Fade"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Paper from "@material-ui/core/Paper"
import Snackbar from "@material-ui/core/Snackbar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import CopyIcon from "@material-ui/icons/ContentCopy"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import * as React from "react"
import * as CopyToClipboard from "react-copy-to-clipboard"
import { RouteComponentProps } from "react-router"
import { Link, Route, Switch } from "react-router-dom"
import { getLocale, IText } from "../locales/locales"
import { IHyconWallet, IRest } from "../rest"

// tslint:disable:object-literal-sort-keys
const styles = createStyles({
    root: {
        flexGrow: 1,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
    },
    flexCenter: {
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
    wallet: IHyconWallet[]
    copied: boolean
}
export class WalletView extends React.Component<IProps, IState & IProps> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            rest: this.props.rest,
            language: this.props.language,
            wallet: [{ name: "Shawn", address: "H4PhGGqqkfmPu542EDHvVqtj9RYfA8BtQ" }],
            copied: false,
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return true
    }

    public handleClick = () => {
        this.setState({ copied: true })
    }
    public handleClose = () => {
        this.setState({ copied: false })
    }
    public render() {
        return (
            <div style={styles.root}>
                <AppBar style={{ background: "transparent", boxShadow: "none", zIndex: 0 }} position="static">
                    <Toolbar style={styles.header}>
                        <Link to="/">
                            <IconButton style={styles.menuButton}><ArrowBackIcon/></IconButton>
                        </Link>
                        <Typography variant="button" align="center">
                            {this.state.wallet[0].name}
                        </Typography>
                        <IconButton><DeleteIcon/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={ styles.flexCenter }>
                    <Input
                        disabled
                        fullWidth
                        value={this.state.wallet[0].address}
                        inputProps={{"aria-label": "Wallet Address"}}
                        style={{ margin: "0 16% 3% 16%", fontSize: "0.75em" }}
                        endAdornment={
                            <InputAdornment position="end">
                                    <CopyToClipboard text={this.state.wallet[0].address}>
                                        <IconButton onClick={this.handleClick}>
                                            <CopyIcon style={{ fontSize: 18 }}/>
                                        </IconButton>
                                    </CopyToClipboard>
                            </InputAdornment>
                        }
                    />
                </div>
                <div style={ styles.flexCenter }>
                    <Typography gutterBottom style={{ fontSize: 24 }}>
                        100000.000000000 <span style={{ fontSize: 10 }}>HYC</span>
                    </Typography>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "15%" }}>
                    <Typography gutterBottom style={{ fontSize: 14 }}>
                        <span style={{ fontSize: 10 }}>PENDING:</span> 500.000000000 <span style={{ fontSize: 10 }}>HYC</span>
                    </Typography>
                </div>
                <div style={{ backgroundColor: "#FFF" }}>
                    <List component="nav">
                        <Link to="/walletactivity" style={{ textDecoration: "none" }}>
                            <ListItem button>
                                <ListItemText primary="See Activity" />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Activity">
                                        <ChevronRightIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                        <Divider />
                        <Link to="/sendcoins" style={{ textDecoration: "none" }}>
                            <ListItem button>
                                <ListItemText primary="Send Hycon" />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Transaction">
                                        <ChevronRightIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                        <Divider />
                        <Link to="/claim" style={{ textDecoration: "none" }}>
                            <ListItem button>
                                <ListItemText primary="Claim Wallet" />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Claim">
                                        <ChevronRightIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    </List>
                </div>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center"}}
                    open={this.state.copied}
                    onClose={this.handleClose}
                    TransitionComponent={Fade}
                    ContentProps={{ "aria-describedby": "message-id" }}
                    message={<span id="message-id">Copied!</span>}
                />
            </div>
        )
    }
}
