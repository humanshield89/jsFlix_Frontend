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
            movieSourceUrl: null
        };
        this.addPendingTask = this.addPendingTask.bind(this);
        this.removePendingTask = this.removePendingTask.bind(this);
        this.handleGoToPlayer = this.handleGoToPlayer.bind(this);
    }

    handleGoToPlayer (movie , sourceLink){
        this.setState(
            {
                onPlayerPage: true,
                moviePlaying : movie,
                movieSourceUrl: sourceLink
            }
        )
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

    render() {
        return (
            <div className="App">
                {!this.state.onPlayerPage ? <div style={{backgroundColor:'transparent'}}>
                    <MyAppBar pendingTasks={this.state.pendingTasks.length > 0}/>
                    <YifyContainer removePendingTask={this.removePendingTask} addPendingTask={this.addPendingTask} goToplayer={this.handleGoToPlayer}/>
                </div> : <PagePlayer movie={this.state.moviePlaying} sourceUrl={this.state.movieSourceUrl}/>}
            </div>
        );
    }
}

export default App;
