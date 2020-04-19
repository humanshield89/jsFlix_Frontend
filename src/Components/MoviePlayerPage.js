
import React from "react";
import Container from "@material-ui/core/Container";


class PagePlayer extends React.Component {


    render() {
        return (
            <Container maxWidth='md' style={{textAlign: 'center'}}>
                {<h1>{this.props.movie.title+' ('+this.props.movie.year+')'}</h1>}
                <video controls style={{width: '100%'}}>
                    <source src={this.props.sourceUrl} type="video/mp4"/>
                </video>
            </Container>
        );
    }
}

export default PagePlayer;