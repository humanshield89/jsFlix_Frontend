import React from "react";
import MoviesList from "./MovieList"
import {makeStyles} from '@material-ui/core/styles';
import MovieDetailsModal from "./MovieDetailsModal";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Pagination from '@material-ui/lab/Pagination';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import {Close} from "@material-ui/icons";

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
        this.a11yPropsTop = this.a11yPropsTop.bind(this);
        this.handleGenreBarChange = this.handleGenreBarChange.bind(this);
        this.makeGenreTabs = this.makeGenreTabs.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleMinimumRatingChange = this.handleMinimumRatingChange.bind(this);
        this.handleOrderValueChange = this.handleOrderValueChange.bind(this);
        this.handleSearchBtnClick = this.handleSearchBtnClick.bind(this);
        this.movieGenre = ['all', 'Action', 'Thriller', 'Crime', 'Adventure', 'Family', 'Animation', 'Drama', 'Romance', 'Comedy', 'Biography', 'History', 'Horror', 'War', 'Mystery', 'Musical', 'Fantasy', 'Music', 'Sport', 'Documentary', 'Sci-Fi', 'Western', 'News'];

        this.sortByQueryValues = ['title', 'year', 'rating', 'download_count', 'like_count', 'date_added'];
        this.sortByReadableValues = ['Title', 'Year', 'Rating', 'Download count', 'Likes', 'Added date'];

        this.minimumRatingValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.minimumRatingReadableValues = ['None', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        this.orderValue = ['asc', "desc"];
        this.orderReadableValue = ['Ascending', "Descending"];

        this.filters = {
            limit: 14,
            page: 1,
            quality: '720p', // 720p, 1080p, 2160p, 3D
            minimum_rating: 0, //0-9
            query_term: "",
            genre: "",
            sort_by: 'year', // String (title, year, rating, peers, seeds, download_count, like_count, date_added, featured)
            order_by: 'desc',//String (desc, asc)
        };
        this.state = {
            totalMovieCount: 0,
            moviesList: [],
            showModal: false,
            currentMovieModal: null,
            videoPlaying: false,
            videoSource: null,
            genreTabValue: 0,
            sortByValue: 1,
            minimumRatingValue: 0,
            orderValue: 1,
        };
        this.getMovieList();
    }

    handleOnMovieCardClick(index) {
        this.setState({
            currentMovieModal: this.state.moviesList[index]
        });
        this.handleOpenModal()
    }

    handleDownload() {
        var torrentId = this.state.currentMovieModal.torrents[0].hash;
        for (var i = 0; i < this.state.currentMovieModal.torrents.length; i++) {
            if (this.state.currentMovieModal.torrents[i].quality === "720p") {
                torrentId = this.state.currentMovieModal.torrents[i].hash;
                break;
            }
        }

        const http = new XMLHttpRequest();
        http.addEventListener('load', () => {
            //var response = JSON.parse(http.responseText)
            console.log(http.responseText);
            this.setState({
                videoSource: backendURL + http.responseText,
                videoPlaying: true
            })
        });
        const url = backendURL + '/?hash=' + torrentId;
        console.log(url);
        http.open("GET", url);
        http.send();

    }

    getMovieList() {
        this.setState({
            totalMovieCount: 0,
            moviesList: [],
        });
        const http = new XMLHttpRequest();
        const url = 'https://yts.mx/api/v2/list_movies.json?sort_by=' + this.filters.sort_by + '&limit='
            + this.filters.limit + '&genre=' + this.filters.genre + '&page=' + this.filters.page + '&minimum_rating=' + this.filters.minimum_rating +
            '&order_by=' + this.filters.order_by + '&query_term='+this.filters.query_term;
        const task = {
            id: 1,
            description: "Fetching movies list from " + url
        };
        this.props.addPendingTask(task);
        http.addEventListener('load', () => {
            if (http.status === 200) {
                const response = JSON.parse(http.responseText);
                this.setState({
                    moviesList: response.data.movies,
                    totalMovieCount: response.data.movie_count
                });
            }
            this.props.removePendingTask(task);
        });

        console.log("fetching movies list from" + url);
        http.open("GET", url);
        http.send();
    }


    handleOpenModal() {
        this.setState({showModal: true});
    }


    handleCloseModal() {
        this.setState({showModal: false});
    }

    makeGenreTabs() {
        return this.movieGenre.map((element, index) => {
            return (
                <Tab label={element} {...this.a11yPropsTop(index)} key={index}/>
            );
        });
    }

    a11yPropsTop(index) {

    }

    handleGenreBarChange(event, newValue) {
        this.filters.genre = (newValue === 0 ? '' : this.movieGenre[newValue]);
        this.filters.page = 1;
        this.setState({
            genreTabValue: newValue,
        });
        this.getMovieList();
    }

    handlePageChange(event, pageValue) {
        this.filters.page = pageValue;
        this.getMovieList();
    }


    handleSortByChange(event) {
        this.filters.sort_by = this.sortByQueryValues[event.target.value];
        this.setState({
            sortByValue: event.target.value
        });
        this.getMovieList();
    }

    handleMinimumRatingChange(event) {
        this.filters.minimum_rating = this.minimumRatingValues[event.target.value];
        this.setState({
            minimumRatingValue: event.target.value
        });
        this.getMovieList();
    }

    handleOrderValueChange(event) {
        this.filters.order_by = this.orderValue[event.target.value];
        this.setState({
            orderValue: event.target.value
        });
        this.getMovieList();
    }

    handleSearchBtnClick(event ){
        this.filters.query_term = document.getElementById('searchField').value;
        this.getMovieList();
    }

    render() {

        return (
            <div style={{textAlign: 'center'}}>
                <Container style={{marginTop: '75px', alignItems:'center', textAlign:'center',width:'100%'}} maxWidth={"lg"}>
                    {this.props.showSearchForm &&
                    <Paper className='filterPaper'  variant="outlined">
                        <div style={{textAlign: 'right'}}><Close onClick={this.props.handleSearchClick} /></div>
                     <FormControl className='FilterformControl' variant={"outlined"} style={{margin:7}}>
                        <InputLabel id="sortBy">Sort by:</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={this.state.sortByValue}
                            onChange={this.handleSortByChange}
                            label="Sort movies by:">
                            {this.sortByReadableValues.map((element, index) => {
                                return (<MenuItem value={index} key={index}>{element}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <FormControl className='FilterformControl' variant={"outlined"} style={{margin:7}}>
                        <InputLabel id="mini-rating-label">Minimum Rating:</InputLabel>
                        <Select
                            labelId="mini-rating-label"
                            id="mini-rating-outlined"
                            value={this.state.minimumRatingValue}
                            onChange={this.handleMinimumRatingChange}
                            label="Movies minimum Rating">
                            {this.minimumRatingReadableValues.map((element, index) => {
                                return (<MenuItem value={index} key={index}>{element}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <FormControl className='FilterformControl' variant={"outlined"} style={{margin:7}}>
                        <InputLabel id="order-label">Order:</InputLabel>
                        <Select
                            labelId="order-label"
                            id="order-select-outlined"
                            value={this.state.orderValue}
                            onChange={this.handleOrderValueChange}
                            label="Movies minimum Rating">
                            {this.orderReadableValue.map((element, index) => {
                                return (<MenuItem value={index} key={index}>{element}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                        <div>
                            <InputBase
                                id='searchField'
                            className='formInput'
                            placeholder="Search Movie"
                            inputProps={{'aria-label': 'search Movies'}}
                        />
                        <IconButton type="submit" className='FormIconButton' aria-label="search" onClick={this.handleSearchBtnClick} >
                            <SearchIcon/>
                        </IconButton>
                        </div>

                    </Paper>
                    }
                </Container>
                {
                    <Tabs value={this.state.genreTabValue} onChange={this.handleGenreBarChange} aria-label="top tabs"
                          variant="scrollable"
                          scrollButtons="on">
                        {this.makeGenreTabs()}
                    </Tabs>

                }
                <Divider/>
                {/**this.state.totalMovieCount !== 0 */ false &&
                <Grid container justify="center" style={{marginTop: '0.5em', marginBottom: '0.5em'}}>
                    <Pagination count={Math.round(this.state.totalMovieCount / this.filters.limit)}
                                page={this.filters.page} onChange={this.handlePageChange} color="primary" size="small"/>
                </Grid>}
                <div className="moviesCardsContainer">
                    <MoviesList moviesList={this.state.moviesList} handleOnClick={this.handleOnMovieCardClick}
                                />
                    {this.state.showModal &&
                    <MovieDetailsModal movie={this.state.currentMovieModal} showModal={this.state.showModal}
                                       handleClose={this.handleCloseModal} handleGoToPlayer={this.props.goToplayer}/>}
                    {this.state.totalMovieCount !== 0 && <Grid container justify="center" style={{padding: '0.5em'}}>
                        <Pagination count={Math.round(this.state.totalMovieCount / this.filters.limit)}
                                    page={this.filters.page} onChange={this.handlePageChange} color="primary"
                                    size="large"/>
                    </Grid>}
                </div>
            </div>
        );
    }
}

export default YifyContainer;