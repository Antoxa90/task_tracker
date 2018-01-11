import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';

class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.project = this.props.match.params.project;
        this.state = {tasks: [], developers: [], add: false, role: localStorage.getItem('role')};

        this.getTasksList();
        this.getDevelopersList();
        this.addTask = this.addTask.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDeveloper = this.onChangeDeveloper.bind(this);
        this.onChangeTimeCosts = this.onChangeTimeCosts.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.renderAddTask = this.renderAddTask.bind(this);
        this.displayTaskForm = this.displayTaskForm.bind(this);
        this.getDeveloperTask = this.getDeveloperTask.bind(this);
    }

    getTasksList() {
        fetch('/api/tasks/'+ this.project)
            .then(res => res.json())
            .then(data => {
                this.setState({tasks: data.listTasks});
            })
    }

    getDevelopersList() {
        fetch('/api/developers', {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(data => data.json())
            .then(item => this.setState({developers: item}));
    }

    getDeveloperTask() {
        fetch('/api/tasks/developer/' + localStorage.getItem('login'), {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(data => data.json())
            .then(item => this.setState({tasks: item.listTasks}));
    }

    addTask(e) {
        this.setState({add: false});

        let json = {
            title: this.state.newTitle,
            project: this.project,
            developer: this.state.newDeveloper,
            description: this.state.newDescription,
            timeCosts: +this.state.newTimeCosts,
            status: this.state.newStatus || 'waiting'
        };

        fetch('/api/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        }).then(data => data.json()).then(res => {
            json._id = res.id;
            this.setState({tasks: [...this.state.tasks, json]});
        });
    }

    onChangeTitle(e) {
        this.setState({newTitle: e.target.value});
    }

    onChangeDescription(e) {
        this.setState({newDescription: e.target.value});
    }

    onChangeTimeCosts(e) {
        this.setState({newTimeCosts: e.target.value});
    }

    onChangeDeveloper(e) {
        this.setState({newDeveloper: e.target.value});
    }

    onChangeStatus(e) {
        this.setState({newStatus: e.target.value});
    }

    displayTaskForm() {
        this.setState({add: true});
    }

    renderAddTask() {
        if(this.state.add) {
            return (
                <div className="add-task">
                    <h2>Add new task</h2>
                    <label>Title: </label>
                    <input type="text" className="form-control" onChange={this.onChangeTitle}
                           placeholder="Enter title"/>
                    <label>Description: </label>
                    <input type="text" className="form-control" onChange={this.onChangeDescription}
                           placeholder="Enter description"/>
                    <label>Developer: </label>
                    <select className="form-control" onChange={this.onChangeDeveloper}>
                        <option value="0">Select developer</option>
                        {
                            this.state.developers.map(function (item, i) {
                                return <option value={item.login} key={i}>{item.login}</option>;
                            })
                        }
                    </select>
                    <label>Estimate time costs: </label>
                    <input type="number" className="form-control" onChange={this.onChangeTimeCosts}
                           placeholder="Enter time costs"/>
                    <label>Task status: </label>
                    <select className="form-control" onChange={this.onChangeStatus}>
                        <option value="waiting">Waiting</option>
                        <option value="implementation">Implementation</option>
                        <option value="verifying">Verifying</option>
                        <option value="releasing">Releasing</option>
                    </select> <br/>
                    <button className="btn btn-default" onClick={this.addTask}>Save</button>
                </div>
            );
        } else {
            return (
                <button className="btn btn-default" onClick={this.displayTaskForm}>Add task</button>
            );
        }
    }

    render() {
        return (<div className="tasks">
            <div className="tasks-table">
                <h2>Tasks</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <td>Number №</td>
                            <td>Status</td>
                            <td>Title</td>
                            <td>Developer ({this.state.role === 'developer' ? <a href="#" onClick={this.getDeveloperTask}>my task</a> : null})</td>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        this.state.tasks.map(function(item, i){
                            return (
                                <tr>
                                    <td key={i}>{i + 1}</td>
                                    <td>{item.status}</td>
                                    <td><Link to={"/tasks/"+item.project+"/"+item._id}>{item.title}</Link></td>
                                    <td>{item.developer}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>

            {this.renderAddTask()}
        </div>);
    }
}

module.exports = Tasks;