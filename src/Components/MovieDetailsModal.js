import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from "@material-ui/core/Paper";
import Zoom from "@material-ui/core/Zoom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import * as PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import WebSocketManager from "../connections/websocket";

const useStyles = makeStyles((theme) => ({
    tabsContainer: {
        backgroundColor: theme.palette.background.default,
    },
    availableStreamsItem: {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1, 1, 1),
        //color: theme.palette.text.secondary,
    },
    modal: {
        display: 'flex',
        //maxWidth: 'sm',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        //backgroundColor: theme.palette.background.paper,
        //border: '1px solid #222222',
        //boxShadow: theme.shadows[1],
        textAlign: 'center',
        alignItems: 'center',
        padding: theme.spacing(0, 0, 0),
        margin: theme.spacing(0),
    },
}));

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TopTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="toptabpanel"
            hidden={value !== index}
            id={`top-tabpanel-${index}`}
            aria-labelledby={`top-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}


function a11yPropsTop(index) {
    return {
        id: `top-tab-${index}`,
        'aria-controls': `top-tabpanel-${index}`,
    };
}


const webSocket = new WebSocketManager(window, (msg) => {
    //setPrepareProgress(msg.value);
});

export default function MovieDetailsModal(props) {
    const classes = useStyles();
    const youtubeEmbed = require('youtube-embed');

    const [value, setValue] = React.useState(0);
    const [preparing, setPreparing] = React.useState(false);
    const [prepareProgress, setPrepareProgress] = React.useState(0.0);
    const [tabValue, setTabValue] = React.useState(0);

    const handleTopBarChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handlePrepareClick = (event) => {
        event.preventDefault();
        let hash = event.target.getAttribute("hash");
        hash = hash ? hash : event.target.parentElement.getAttribute("hash");
        console.log(event.target);
        console.log(hash);
        webSocket.onMessageReceived = (msg) => {
            console.log(msg.value);
            setPrepareProgress(msg.value);
        };
        webSocket.socketSendMessage(hash);
        setPreparing(true);
    };

    function handleWatchNowClick(event) {
        let movie = props.movie;
        let hash = event.target.getAttribute("hash");
        hash = hash ? hash : event.target.parentElement.getAttribute("hash");
        let sourceURL = 'https://jsflixapi.humanshield85.tk/movie?hash=' + hash;
        props.handleGoToPlayer(movie, sourceURL);
    }

    const makeTabs = (movie) => {
        if (!movie) return [];

        const sortedTorrents = movie.torrents.sort((a, b) => {
            function getNumberEquivalent(quality, type) {
                var i = 0;
                if (quality === '720p') i += 1;
                if (quality === '1080p') i += 2;
                if (quality === '2160p') i += 3;
                if (quality === '3D') i += 4;
                if (type === 'bluray') i += 10;
                if (type === 'web') i += 20;
                //console.log('i for '+quality+' and '+type+ ' = '+i);
                return i;
            }

            let numA = getNumberEquivalent(a.quality, a.type);
            let numB = getNumberEquivalent(b.quality, b.type);
            if (numA > numB) return 1;
            return -1;
        });

        const tabHeaders = sortedTorrents.map(((value1, index) => {
            return <Tab label={value1.quality + ' ' + value1.type} key={index} {...a11yProps(index)} />;
        }));
        const tabContainers = sortedTorrents.map(((value1, index) => {
            return (
                <TabPanel value={value} index={index} key={index} className={classes.tabsContainer}>
                    <Paper className={classes.availableStreamsItem}>
                        <Typography variant='h6' component='h6'>
                            <p>{"File size: " + value1.size}</p>
                            <p>{"Duration: " + movie.runtime + " minutes   "}</p>
                            {!preparing &&
                            <Button variant="contained" color="primary" component="span" hash={value1.hash}
                                    onClick={handlePrepareClick}>
                                Prepare A Stream!
                            </Button>}
                            {preparing &&
                            <div>
                                <p>Preparing video Stream : {prepareProgress + " %"}</p>
                                {
                                    (prepareProgress > 5) &&
                                    <Button onClick={handleWatchNowClick} variant="contained" color="primary"
                                            component="span" hash={value1.hash}>
                                        Watch Now
                                    </Button>
                                }
                            </div>

                            }
                        </Typography>
                    </Paper>
                </TabPanel>
            );
        }));
        return [tabHeaders, tabContainers];
    };
    const tabsArray = makeTabs(props.movie);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.showModal}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Zoom in={props.showModal}>
                <Paper className={classes.paper} style={{ maxHeight: '95%',height: '1080px', position: 'relative'}}>
                    <AppBar position="static">
                            <Tabs value={tabValue} onChange={handleTopBarChange} aria-label="top tabs" centered>
                                <Tab label="Details" {...a11yPropsTop(0)} />
                                <Tab label="Available Streams" {...a11yPropsTop(1)} />
                            </Tabs>
                        </AppBar>
                    <div style={{ maxHeight: '85%',height: '1080px', position: 'relative', overflow: 'auto' }}>
                        <TopTabPanel value={tabValue} index={0}>
                            <Container maxWidth="sm">
                                <Typography id="transition-modal-title" variant='h2'>
                                    {props.movie && props.movie.title}
                                </Typography>
                                <span style={{ textAlign: 'left' }}>
                                        <Typography variant='h6'>
                                            Summary:
                                 </Typography>
                                        <Typography variant='subtitle1'>
                                            <p id="transition-modal-description">{props.movie && props.movie.summary}</p>
                                        </Typography>
                                    </span>

                            </Container>
                            <Container maxWidth="sm">
                                <Typography variant='h6'>
                                    <p style={{
                                        marginTop: '0.3em',
                                        marginBottom: '0.3em',
                                        textAlign: 'left'
                                    }}>Trailer:</p>
                                </Typography>
                                <div className='embed-responsive embed-responsive-16by9'>
                                    <iframe className='embed-responsive-item'
                                            style={{ width: '100%', height: '300px', position: 'relative' }}
                                            src={youtubeEmbed('https://www.youtube.com/watch?v=' + (props.movie ? props.movie.yt_trailer_code : ''))}
                                            frameBorder="0" />
                                </div>
                            </Container>
                        </TopTabPanel>
                        <TopTabPanel value={tabValue} index={1}>
                            <Container maxWidth="sm" style={{margin:0,padding:0}}>
                                    <span style={{ textAlign: 'left' }}>
                                        <Typography variant='h6'>
                                            Guide:
                                        </Typography>
                                        <Typography variant='subtitle1'>
                                            <p id="transition-modal-description">
                                                Choose your desired quality , we will prepare a stream for you ,Once the stream is prepared a watch now button will show click it to start watching your movie
                                            </p>
                                        </Typography>
                                    </span>
                                <Container  maxWidth="sm" style={{margin:0,padding:0}}>
                                    <Typography variant='h5'>
                                        <p style={{marginTop: '0.3em', marginBottom: '0.3em'}}>Available Streams</p>
                                    </Typography>
                                    <AppBar position="static" color='default'>
                                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs"
                                              indicatorColor="primary"
                                              textColor="primary"
                                              variant="scrollable"
                                              scrollButtons="auto">
                                            {tabsArray[0]}
                                        </Tabs>
                                    </AppBar>
                                    {tabsArray[1]}
                                </Container>
                            </Container>

                            {/**
                             <Container maxWidth='sm'>
                             <Typography variant='h5'>
                             <p style={{marginTop: '0.3em', marginBottom: '0.3em'}}>Available Streams</p>
                             </Typography>
                             <AppBar position="static" color='default'>
                             <Tabs value={value} onChange={handleChange} aria-label="simple tabs"
                             indicatorColor="primary"
                             textColor="primary"
                             variant="scrollable"
                             scrollButtons="auto">
                             {tabsArray[0]}
                             </Tabs>
                             </AppBar>
                             {tabsArray[1]}
                             </Container> ** /
                             */}
                        </TopTabPanel>
                    </div>
                    <Button onClick={props.handleClose} variant='outlined' color='secondary' style={{margin:'0.5em',bottom: '5px' ,right:"5px",position:'absolute' } }>Close</Button>
                </Paper>
            </Zoom>
        </Modal>
    );
}