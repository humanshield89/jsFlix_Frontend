import React from 'react';
import './App.css';
import YifyContainer from "./Components/YifyContainer";
import MyAppBar from "./Components/MyAppBar";
import PagePlayer from "./Components/MoviePlayerPage";

class App extends React.Component {

    export;
    default;
    App;


    constructor(props) {
        super(props);
        this.state = {
            pendingTasks: [],
            onPlayerPage: false,
            moviePlaying: null,
            showSearchForm: false,
            movieSourceUrl: null
        };

        this.addPendingTask = this.addPendingTask.bind(this);
        this.removePendingTask = this.removePendingTask.bind(this);
        this.handleGoToPlayer = this.handleGoToPlayer.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.closePlayerPage = this.closePlayerPage.bind(this);
    }

    handleGoToPlayer (movie , sourceLink,previousState){
        this.setState(
            {
                onPlayerPage: true,
                moviePlaying : movie,
                movieSourceUrl: sourceLink,
                previousYifyContainerState: previousState
            }
        )
    }

    closePlayerPage(){
        this.setState({
            onPlayerPage: false,
            moviePlaying : '',
            movieSourceUrl: ""
        })
    }

    addPendingTask(task) {
        console.log('adding pending task ');
        console.log(this.state.pendingTasks);
        let prevTasks = this.state.pendingTasks;
        prevTasks.push(task);
        this.setState({
            pendingTasks: prevTasks
        });
    }

    removePendingTask(task) {
        console.log('removing pending  task ');
        const newPendingTasksArray = this.state.pendingTasks.filter((value, index, array) => {
            return value.id !== task.id
        });

        this.setState(
            {
                pendingTasks: newPendingTasksArray
            }
        );
    }

    handleSearchClick(event){
        this.setState({
            showSearchForm : !this.state.showSearchForm
        })
    }

    render() {
        return (
            <div className="App">
                {!this.state.onPlayerPage ? <div style={{backgroundColor:'transparent'}}>
                    <MyAppBar pendingTasks={this.state.pendingTasks.length > 0} handleSeachClick={this.handleSearchClick} searchFormVisible={this.state.showSearchForm}/>
                    <YifyContainer removePendingTask={this.removePendingTask} addPendingTask={this.addPendingTask} goToplayer={this.handleGoToPlayer} handleSearchClick={this.handleSearchClick} showSearchForm={this.state.showSearchForm} previousState={this.state.previousYifyContainerState}/>
                </div> : <PagePlayer movie={this.state.moviePlaying} sourceUrl={this.state.movieSourceUrl} closePlayerCallback={this.closePlayerPage}/>}
            </div>
        );
    }
}

export default App;
