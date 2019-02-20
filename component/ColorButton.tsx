import { createStyles } from "@material-ui/core"
import Fab from "@material-ui/core/Fab"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import * as React from "react"

const styles = (theme: Theme) => createStyles({
    btn: {
        background: "linear-gradient(45deg, #172349 30%, #1ADAD8 100%)",
        border: 0,
        boxShadow: "0 1px 2px 1px rgba(76, 69, 225, .3)",
        color: "white",
        marginTop: 5,
    },
})

interface IProps extends WithStyles<typeof styles> {
    disabled?: boolean
    fullWidth?: boolean
    onClick: () => void
    size?: "small" | "medium" | "large" | undefined
}
class ColorButton extends React.PureComponent<IProps, any> {
    public render() {
        return <Fab
                    className={this.props.classes.btn}
                    disabled={this.props.disabled === undefined ? false : this.props.disabled}
                    onClick={this.props.onClick}
                    size={this.props.size === undefined ? "medium" : this.props.size}
                    style={{ width: this.props.fullWidth ? "100%" : 0 }}
                    variant="extended"
                >{this.props.children}</Fab>
    }
}

export default withStyles(styles)(ColorButton)
