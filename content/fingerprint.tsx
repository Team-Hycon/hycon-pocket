import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { IText } from "../locales/m_locales"

interface IProps {
    language: IText
}

export class FingerprintContent extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
    }

    public render() {
        return (
            <DialogContent><DialogContentText>
                <Typography style={{ textAlign: "justify" }} variant="body2" gutterBottom>
                    {this.props.language["fingerprint-text1"]}
                </Typography>
                <br />
                <Typography style={{ textAlign: "justify" }} variant="body2" gutterBottom>
                    {this.props.language["fingerprint-text3"]}
                </Typography>
                <br />
                <Typography style={{ textAlign: "justify" }} variant="body2" gutterBottom>
                    {this.props.language["fingerprint-text2"]}                
                </Typography>
            </DialogContentText></DialogContent>
        )
    }
}
