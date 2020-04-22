import React from "react";
import MovieCard from "./MovieCard";
import Grid from "@material-ui/core/Grid";

class MoviesList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.moviesList ? <div className='moviesList'>
                {this.props.moviesList.map((movie, index) => <MovieCard movie={movie} key={index}
                                                                        handleClick={this.props.handleOnClick}
                                                                        index={index}/>)}
            </div>
                :
                <div  style={{width:'100%',height:'100%',display: 'inline-block', verticalAlign: 'middle'}}><p style={{margin:'auto',width:'250px',height:'50px' ,display: 'inline-block', verticalAlign: 'middle'}}>No movies matched your query :/</p></div>
        );
    }
}

export default MoviesList;