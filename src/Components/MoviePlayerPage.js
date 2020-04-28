
import React from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";


class PagePlayer extends React.Component {


    render() {
        return (
            <Container maxWidth='md' style={{textAlign: 'center'}}>

                {<h1>{this.props.movie.title+' ('+this.props.movie.year+')'}</h1>}
                <video controls style={{width: '100%'}}>
                    <source src={this.props.sourceUrl} type="video/mp4"/>
                </video>
                <div style={{textAlign: 'center' , marginTop:'40px'}}><Button onClick={this.props.closePlayerCallback} variant="contained" color="primary">Return to Movies listing</Button></div>
            </Container>
        );
    }
}

export default PagePlayer;