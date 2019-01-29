import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { IText } from "../locales/m_locales"

interface IProps {
    language: IText
}

export class ChangelogContent extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
    }

    public render() {
        return (
            <DialogContent><DialogContentText>
                <Typography style={{ textAlign: "justify", paddingBottom: 20 }} variant="caption" gutterBottom>
                    {this.props.language["changelog-120-content1"]}<br />
                    {this.props.language["changelog-120-content2"]}<br />
                    {this.props.language["changelog-120-content3"]}<br />
                    {this.props.language["changelog-120-content4"]}<br />
                </Typography>
                <br />
                <Typography variant="overline" style={{ fontWeight: 600 }} gutterBottom>{this.props.language["changelog-111"]}</Typography>
                <Typography style={{ textAlign: "justify" }} variant="caption" gutterBottom>
                    {this.props.language["changelog-112-content1"]}<br />
                    {this.props.language["changelog-112-content2"]}<br />
                    {this.props.language["changelog-112-content3"]}<br />
                    {this.props.language["changelog-112-content4"]}<br />
                    {this.props.language["changelog-112-content5"]}<br />
                    {this.props.language["changelog-112-content6"]}<br />
                    {this.props.language["changelog-112-content7"]}<br />
                    {this.props.language["changelog-112-content8"]}<br />
                    {this.props.language["changelog-112-content9"]}<br />
                    {this.props.language["changelog-112-content10"]}<br />
                    {this.props.language["changelog-112-content11"]}<br />
                    {this.props.language["changelog-112-content12"]}<br />
                    {this.props.language["changelog-112-content13"]}
                </Typography>
                <br />
                <Typography variant="overline" style={{ fontWeight: 600 }} gutterBottom>{this.props.language["changelog-111"]}</Typography>
                <Typography style={{ textAlign: "justify" }} variant="caption" gutterBottom>
                    {this.props.language["changelog-111-content1"]}<br />
                    {this.props.language["changelog-111-content2"]}<br />
                    {this.props.language["changelog-111-content3"]}<br />
                    {this.props.language["changelog-111-content4"]}<br />
                    {this.props.language["changelog-111-content5"]}<br />
                    {this.props.language["changelog-111-content6"]}<br />
                    {this.props.language["changelog-111-content7"]}<br />
                    {this.props.language["changelog-111-content8"]}
                </Typography>
                <br />
                <Typography variant="overline" style={{ fontWeight: 600 }} gutterBottom>{this.props.language["changelog-101"]}</Typography>
                <Typography style={{ textAlign: "justify" }} variant="caption" gutterBottom>
                    {this.props.language["changelog-101-content1"]}<br />
                    {this.props.language["changelog-101-content2"]}<br />
                    {this.props.language["changelog-101-content3"]}
                </Typography>
                <br />
                <Typography variant="overline" style={{ fontWeight: 600 }} gutterBottom>{this.props.language["changelog-100"]}</Typography>
                <Typography style={{ textAlign: "justify" }} variant="caption" gutterBottom>
                    {this.props.language["changelog-100-content"]}
                </Typography>
            </DialogContentText></DialogContent>
        )
    }
}
