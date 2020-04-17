import React from "react";
import MoviesList from "./MovieList"
import ReactModal from "react-modal";
import Modal from "react-modal"
import webTorrent from "webtorrent"
import { makeStyles } from '@material-ui/core/styles';


const WebTorrent = require('webtorrent');

const backendURL = 'https://jsflixapi.humanshield85.tk';
class YifyContainer extends React.Component {
    constructor(props) {
        super(props);
        this.getMovieList = this.getMovieList.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleOnMovieCardClick = this.handleOnMovieCardClick.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.getVideoPlayer = this.getVideoPlayer.bind(this);
        this.state = {
            filters: {
                limit: 50,
                page: 1,
                quality: '720p', // 720p, 1080p, 2160p, 3D
                minimum_rating: 0, //0-9
                query_term: "",
                genre: "",
                sort_by: 'download_count', // String (title, year, rating, peers, seeds, download_count, like_count, date_added, featured)
                order_by: 'desc',//String (desc, asc)
            },
            moviesList: [],
            showModal: false,
            currentMovieModal: null,
            videoPlaying : false,
            videoSource : null

        }
        this.getMovieList();
    }

    handleOnMovieCardClick(index) {
        this.setState({
            currentMovieModal : this.state.moviesList[index]
        })
        this.handleOpenModal()
    }

    handleDownload(){
        var torrentId = this.state.currentMovieModal.torrents[0].hash;
        for(var i = 0 ; i < this.state.currentMovieModal.torrents.length ; i++){
            if(this.state.currentMovieModal.torrents[i].quality === "720p"){
                torrentId = this.state.currentMovieModal.torrents[i].hash
                break;
            }
        }

        const http = new XMLHttpRequest();
        http.addEventListener('load', () => {
            //var response = JSON.parse(http.responseText)
            console.log(http.responseText)
            this.setState({
                videoSource: backendURL + http.responseText,
                videoPlaying : true
            })
        })
        const url = backendURL+'/?hash='+torrentId;
        console.log(url)
        http.open("GET", url);
        http.send();

    }

    getVideoPlayer(){
        if(this.state.videoPlaying)
        return (

         <video
            controls
            preload="metadata"//"auto"
            width="1280"
            height="540"
            poster={this.state.currentMovieModal.background_image_original}
            >
            <source src={this.state.videoSource} type="video/mp4"/>
        </video>);
    }

    getMovieList() {
        const http = new XMLHttpRequest();
        http.addEventListener('load', () => {
            if(http.status === 200){
                const response = JSON.parse(http.responseText);
                this.setState({
                    moviesList: response.data.movies
                })
            }
        });

        const url = 'https://yts.mx/api/v2/list_movies.json?sort_by='+this.state.filters.sort_by+'&limit='+this.state.filters.limit;
        console.log("fetching movies list from"+url);
        http.open("GET", url);
        http.send();
    }


    handleOpenModal () {
        this.setState({ showModal: true });
    }


    handleCloseModal () {
        this.setState({ showModal: false });
    }


    render() {
        const classes = makeStyles((theme) => ({
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                '& > *': {
                    margin: theme.spacing(1),
                    width: theme.spacing(16),
                    height: theme.spacing(16),
                },
            },
        }));
        return (
            <div className="moviesCardsContainer">
                <MoviesList moviesList={this.state.moviesList} handleOnClick={this.handleOnMovieCardClick} class={classes.root}/>
                <ReactModal id="modalContainer" isOpen={this.state.showModal} shouldCloseOnOverlayClick={true} contentLabel="Minimal Modal Example" onRequestClose={this.handleCloseModal}>
                    <h1>{this.state.currentMovieModal && this.state.currentMovieModal.title}</h1>
                    {!this.state.videoPlaying && <button onClick={this.handleDownload}>Download</button>}
                    {this.getVideoPlayer()}
                </ReactModal>
            </div>
        );
    }
}

export default YifyContainer;