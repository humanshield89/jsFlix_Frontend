import React from "react";
import MovieCard from "./MovieCard";

class MoviesList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='moviesList'>
                {this.props.moviesList.map((movie, index) => <MovieCard movie={movie} key={index}
                                                                        handleClick={this.props.handleOnClick}
                                                                        index={index}/>)}
            </div>
        );
    }
}

export default MoviesList;