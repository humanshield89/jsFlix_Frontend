import React from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default function CardQualityStream(props){
    const [preparing, setPreparing] = React.useState(false);
    const [prepareProgress, setPrepareProgress] = React.useState(0.0);

    const handlePrepareClick = (event) => {
        event.preventDefault();
        let hash = event.target.getAttribute("hash");
        hash = hash ? hash : event.target.parentElement.getAttribute("hash");
        console.log(event.target);
        console.log(hash);
        props.webSocket.onMessageReceived = (msg) => {
            console.log(msg.value);
            setPrepareProgress(msg.value);
        };
        props.webSocket.socketSendMessage(hash);
        setPreparing(true);
    };

    function handleWatchInSDNowClick(event) {
        let movie = props.movie;
        let hash = event.target.getAttribute("hash");
        hash = hash ? hash : event.target.parentElement.getAttribute("hash");
        let sourceURL = 'https://jsflixapi.humanshield85.tk/movie?hash=' + hash+"&quality=1";
        props.handleGoToPlayer(movie, sourceURL);
    }

    function handleWatchNowClick(event) {
        let movie = props.movie;
        let hash = event.target.getAttribute("hash");
        hash = hash ? hash : event.target.parentElement.getAttribute("hash");
        let sourceURL = 'https://jsflixapi.humanshield85.tk/movie?hash=' + hash;
        props.handleGoToPlayer(movie, sourceURL);
    }


    return (
        <TabPanel value={props.value} index={props.index} key={props.index} className={props.classes.tabsContainer}>
            <Paper className={props.classes.availableStreamsItem}>
                <Typography variant='h6' component='h6'>
                    <p>{"File size: " + props.torrent.size}</p>
                    <p>{"Duration: " + props.movie.runtime + " minutes   "}</p>
                    {!preparing &&
                    <Button variant="contained" color="primary" component="span" hash={props.torrent.hash}
                            onClick={handlePrepareClick}>
                        Prepare A Stream!
                    </Button>}
                    {preparing &&
                    <div>
                        <Divider variant="middle"/>
                        <p>Preparing video Streams : {prepareProgress + " %"} </p>
                        <Divider variant="middle"/>
                        {
                            (prepareProgress > 5) ?
                                <p><p>Full quality ready : </p>
                                <Button onClick={handleWatchNowClick} variant="contained" color="primary"
                                                                component="span" hash={props.torrent.hash}>
                                    Watch Now
                                </Button></p>
                                :
                                <p><p>Preparring Full quality :</p><CircularProgress /></p>
                        }
                        <div>
                            <Divider variant="middle"/>
                            {(prepareProgress <  100) ?
                                <p><p>Preparing SD quality stream : </p><CircularProgress /></p>
                                :
                                <p><p>Low resolution stream ready :</p> <Button onClick={handleWatchInSDNowClick} variant="contained" color="secondary"
                                                                         component="span" hash={props.torrent.hash}>
                                    Watch in low resolution Now
                                </Button></p>}
                        </div>
                    </div>

                    }
                </Typography>
            </Paper>
        </TabPanel>
    )
}