import React from 'react';
import './App.css';
import YifyContainer from "./Components/YifyContainer";
import MyAppBar from "./Components/MyAppBar";

class App extends React.Component {

    export;
    default;
    App;

    constructor(props) {
        super(props);
        this.state = {
            pendingTasks: []
        };
        this.addPendingTask = this.addPendingTask.bind(this);
        this.removePendingTask = this.removePendingTask.bind(this);
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
                <MyAppBar pendingTasks={this.state.pendingTasks.length > 0}/>
                <YifyContainer removePendingTask={this.removePendingTask} addPendingTask={this.addPendingTask}/>
            </div>
        );
    }
}

export default App;
