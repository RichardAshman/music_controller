import React, { Component } from "React";
import { Grid, Button, Typography } from "@material-ui/core";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    }

    getRoomDetails() {
        fetch("/api/get-room/" + "?code=" + this.roomCode)
            .then((response) => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    leaveButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/api/leave-room/", requestOptions)
            .then((response) => {
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            });
    }

    render() {
        return (
            <Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest can pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
