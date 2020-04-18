import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
const useStyles = makeStyles((theme) => ({
    tabsContainer : {
        backgroundColor: theme.palette.background.default,
    },
    availableStreamsItem : {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1, 1, 1),
        //color: theme.palette.text.secondary,
    },
    modal: {
        display: 'flex',
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

export default function MovieDetailsModal(props) {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const youtubeEmbed = require('youtube-embed');
    const makeTabs = (movie) => {
        if(!movie) return [];

        const sortedTorrents = movie.torrents.sort((a , b) => {
            function getNumberEquivalent(quality , type ) {
                var i = 0;
                if(quality === '720p') i+=1;
                if(quality === '1080p') i+=2;
                if(quality === '2160p') i+=3;
                if(quality === '3D') i+=4;
                if(type === 'bluray') i+=10;
                if(type === 'web') i+=20;
                //console.log('i for '+quality+' and '+type+ ' = '+i);
                return i;
            }
            let numA = getNumberEquivalent(a.quality,a.type);
            let numB = getNumberEquivalent(b.quality,b.type);
            if (numA > numB)  return 1;
            return -1;
        });

        const tabHeaders = sortedTorrents.map(((value1, index) => {
            return <Tab label={value1.quality+' '+value1.type} key={index} {...a11yProps(index)} />;
        }));
        const tabContainers = sortedTorrents.map(((value1, index) => {
            return    (
                <TabPanel value={value} index={index} key={index} className={classes.tabsContainer}>
                    <Paper className={classes.availableStreamsItem}>
                        <Typography variant='h6' component='h6'>
                            <p>{"File size: "+value1.size}</p>
                            <p>{"Duration: "+movie.runtime+ " minutes   "}</p>
                            <Button variant="contained" color="primary" component="span">
                                Prepare
                            </Button>
                        </Typography>
                    </Paper>
                </TabPanel>
            );
        }));
        return [tabHeaders,tabContainers];
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
                    <Paper className={classes.paper} style={{maxHeight : '100%',position: 'relative',overflow:'auto'}} >
                        <Grid >
                         <Container maxWidth="sm" >
                            <Typography id="transition-modal-title" variant='h2'>
                                {props.movie && props.movie.title}
                            </Typography>
                             <span style={{textAlign: 'left'}}>
                                 <Typography variant='h6' >
                                     Summary:
                                 </Typography>
                                 <Typography variant='subtitle1'>
                                     <p id="transition-modal-description">{props.movie && props.movie.summary}</p>
                                 </Typography>
                             </span>

                        </Container>
                        <Container maxWidth="sm" >
                            <Typography variant='h6'>
                                <p style={{marginTop: '0.3em', marginBottom: '0.3em', textAlign: 'left'}}>Trailer:</p>
                            </Typography>
                            <div className='embed-responsive embed-responsive-16by9'>
                            <iframe className='embed-responsive-item' style={{width: '100%', height: '300px', position: 'relative'}} src={youtubeEmbed('https://www.youtube.com/watch?v=' + (props.movie ? props.movie.yt_trailer_code : ''))} frameBorder="0"/>
                            </div>
                        </Container>
                            <Container maxWidth='sm' style={{margin: '0 !important' ,marginLeft: '0' , marginRight: '0', paddingTop: '0', paddingBottom: '0'}}>
                                <Typography variant='h5'>
                                    <p style={{marginTop: '0.3em', marginBottom: '0.3em'}}>Available Streams</p>
                                </Typography>
                                <AppBar position="static"color='default'>
                                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs" indicatorColor="primary"
                                          textColor="primary"
                                          variant="scrollable"
                                          scrollButtons="auto">
                                        {tabsArray[0]}
                                    </Tabs>
                                </AppBar>
                                {tabsArray[1]}
                            </Container>
                        </Grid>
                    </Paper>
                </Zoom>
            </Modal>
    );
}