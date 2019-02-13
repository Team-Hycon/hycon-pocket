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
                    When you launch the app for the first time (not from background), you will need your fingerprint to use the app.
                </Typography>
                <br />
                <Typography style={{ textAlign: "justify" }} variant="body2" gutterBottom>
                    Keep in mind, sharing your device with anyone who has saved a fingerprint or knows your passcode gives that person access to this app. We don't recommend using fingerprint if you share your device.
                </Typography>
            </DialogContentText></DialogContent>
        )
    }
}
