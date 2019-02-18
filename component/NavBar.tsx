import { createStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import * as React from "react"

const styles = (theme: Theme) => createStyles({
    appBar: {
        background: "transparent",
        boxShadow: "none",
        zIndex: 0,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
    },
    icon: {
        height: 48,
        width: 48,
    },
})

interface IProps extends WithStyles<typeof styles> {
    handleDialog: (open: boolean) => void
    leftElement?: any
    oneHanded: boolean
    rightElement?: any
    title: string
}

class NavBar extends React.PureComponent<IProps, any> {
    public render() {
        return (
            <AppBar className={this.props.classes.appBar} style={{ margin: this.props.oneHanded ? "15vh 0" : 0 }} position="static">
                <Toolbar className={this.props.classes.header}>
                    {this.props.leftElement === undefined ?
                        <IconButton onClick={() => this.props.handleDialog(false)}>
                            <ArrowBackIcon />
                        </IconButton> : this.props.leftElement
                    }
                    <Typography variant={this.props.oneHanded ? "h2" : "button"} align="center">
                        {this.props.title}
                    </Typography>
                    {this.props.rightElement === undefined ? <div className={this.props.classes.icon}/> : this.props.rightElement }
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(NavBar)
