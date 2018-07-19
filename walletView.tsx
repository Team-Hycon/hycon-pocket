import { createStyles, InputAdornment } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Fade from "@material-ui/core/Fade"
import IconButton from "@material-ui/core/IconButton"
import Input from "@material-ui/core/Input"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Snackbar from "@material-ui/core/Snackbar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
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
        console.log(this.state.copied)
    }
    public handleClose = () => {
        this.setState({ copied: false })
        console.log(this.state.copied)
    }
    public render() {
        return (
            <div style={styles.root}>
                <AppBar style={{ background: "transparent", boxShadow: "none", zIndex: 0 }} position="static">
                    <Toolbar style={styles.header}>
                        <IconButton style={styles.menuButton}><ArrowBackIcon/></IconButton>
                        <Typography variant="button" align="center">
                            {this.state.wallet[0].name}
                        </Typography>
                        <IconButton><DeleteIcon/></IconButton>
                    </Toolbar>
                </AppBar>
                {/* <Typography variant="button" align="center" gutterBottom>
                    {this.state.wallet[0].name}
                </Typography> */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Input
                        disabled
                        fullWidth
                        value={this.state.wallet[0].address}
                        inputProps={{"aria-label": "Wallet Address"}}
                        style={{ margin: "0 10%", fontSize: 14 }}
                        endAdornment={
                            <InputAdornment position="end">
                                    <CopyToClipboard text={this.state.wallet[0].address}>
                                        <IconButton onClick={this.handleClick}>
                                            <CopyIcon/>
                                        </IconButton>
                                    </CopyToClipboard>
                            </InputAdornment>
                        }
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Input
                        disabled
                        fullWidth
                        value="10000.000000000"
                        inputProps={{ "aria-label": "Wallet Balance" }}
                        style={{ margin: "0 10%", fontSize: 24 }}
                        endAdornment={
                            <InputAdornment position="end">
                                HYC
                            </InputAdornment>
                        }
                    />
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
            // <Page renderToolbar={() => this.renderToolbar()}>
            //     <Row>
            //         <Col verticalAlign="center">
            //             Wallet Name
            //         </Col>
            //     </Row>
            //     <Row>
            //         <Col verticalAlign="center">
            //             <Input
            //                 value={this.state.wallet}
            //                 disabled
            //             />
            //         </Col>
            //     </Row>
            //     <ListItem modifier="chevron">
            //         See Activity
            //     </ListItem>
            //     <ListItem modifier="chevron">
            //         Send HYC
            //     </ListItem>
            //     <Link to="/claim">
            //         <ListItem modifier="chevron">
            //             Claim Wallet
            //         </ListItem>
            //     </Link>
            // </Page>
        )
    }
}
