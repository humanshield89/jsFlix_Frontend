import React from "react";
import Card from "@material-ui/core/Card";
import StarIcon from '@material-ui/icons/Star';
import CardActionArea from "@material-ui/core/CardActionArea";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import Zoom from "@material-ui/core/Zoom";

class MovieCard extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseIn = this.handleMouseIn.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.getQualityChips = this.getQualityChips.bind(this);
        this.state = {
            isHovered: false
        }
    }

    handleMouseIn(event) {
        this.setState({isHovered: true})
    }

    handleMouseOut(event) {
        this.setState({isHovered: false})
    }

    handleClick() {
        this.props.handleClick(this.props.index)
    }

    getQualityChips() {

        let chips = [];
        for (let i = 0; i < this.props.movie.torrents.length; i++) {
            if (this.props.movie.torrents[i].quality === '720p') {
                chips[0] = this.movieQualitiesChip('720p');
            } else if (this.props.movie.torrents[i].quality === '1080p') {
                chips[1] = this.movieQualitiesChip('1080p');
            } else if (this.props.movie.torrents[i].quality === '3D') {
                chips[2] = this.movieQualitiesChip('3D');
            } else if (this.props.movie.torrents[i].quality === '2160p') {
                chips[3] = this.movieQualitiesChip('2160p');
            }
        }
        return chips;
    }

    movieQualitiesChip(text) {
        return (
            <Chip size="small" label={text} key={text} className="qualityChips"/>
        )
    }

    render() {
        return (
            <Zoom direction="up" in={true} mountOnEnter unmountOnExit
                  style={{transitionDelay: this.props.index * 30 + "ms"}}>
                <Card className="movieCard" elevation={this.state.isHovered ? 10 : 3} onClick={this.handleClick}
                      onMouseOver={this.handleMouseIn} onMouseOut={this.handleMouseOut}>
                    <CardActionArea>

                        <img src={this.props.movie.medium_cover_image} alt="cover_photo_here"
                             className="movieCardCoverPicture"/>
                        <div className='cardMovieTitle'>
                            <h3>
                                {this.props.movie.title}
                            </h3>
                        </div>
                        <Divider variant="middle"/>
                        <div className="imdbNote">
                            <span>IMDB {this.props.movie.rating}</span>
                            <StarIcon style={{fontSize: 11}}>{this.props.movie.rating}/10</StarIcon>
                        </div>
                        <p className="cardNormalText">{this.props.movie.year}</p>
                        <div className='qualityChipsContainer'>
                            {this.getQualityChips()}
                        </div>
                    </CardActionArea>
                </Card>
            </Zoom>
        );
    }
}

export default MovieCard;