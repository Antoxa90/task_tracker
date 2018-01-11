import React from 'react';
import { Route, Link } from 'react-router-dom';

class Projects extends React.Component {
    constructor(){
        super();

        this.role = '';
        this.state = {items: [], developers: [], add: false, role: localStorage.getItem('role'), addField: false, idProject: ''};
        this.onClickButton = this.onClickButton.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onDevelopersChange = this.onDevelopersChange.bind(this);
        this.renderAddProject = this.renderAddProject.bind(this);
        this.displayProjectForm = this.displayProjectForm.bind(this);
        this.addDeveloper = this.addDeveloper.bind(this);
        this.developerField = this.developerField.bind(this);
        this.onChangeDeveloper = this.onChangeDeveloper.bind(this);
        this.saveDeveloper = this.saveDeveloper.bind(this);

        this.getProjectsList();
        this.getDevelopersList();
    }

    getProjectsList() {
        let role = localStorage.getItem('role');
        this.role = role;
        let login = localStorage.getItem('login');
        if(role === 'manager')
            fetch('/api/projects/manager/' + login)
                .then(data => data.json())
                .then(item => this.setState({items: item.listProjects}));

        if(role === 'developer')
            fetch('/api/projects/developer/' + login)
                .then(data => data.json())
                .then(item => this.setState({items: item.listProjects}));
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

    onTitleChange(e) {
        this.setState({newTitle: e.target.value});
    }

    onDescriptionChange(e) {
        this.setState({newDescription: e.target.value});
    }

    onClickButton(e) {
        this.setState({add: false});

        let json = {
            title: this.state.newTitle,
            description: this.state.newDescription,
            developers: this.state.newDevelopers,
            manager: localStorage.getItem('login')
        };


        fetch('/api/project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        }).then(data => data.json()).then(res => {
            this.setState({items: [...this.state.items, json]});
        });
    }

    onDevelopersChange(e) {
        let options = e.target.options;
        let value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({newDevelopers: value});
    }

    displayProjectForm() {
        this.setState({add: true});
    }

    renderAddProject() {
        if(this.state.add) {
            return (
                <div className="add-project">

                    <label>Title project: </label>
                    <input type="text" onChange={this.onTitleChange} className="form-control"
                           placeholder="Enter title project"/>
                    <label>Description</label>
                    <textarea type="text" onChange={this.onDescriptionChange} className="form-control"
                              placeholder="Enter description project"></textarea>
                    <label>Developers</label>
                    <select multiple={true} onChange={this.onDevelopersChange} className="form-control" ref="dev">
                        {
                            this.state.developers.map(function (item) {
                                return <option value={item.login} key={item._id}>{item.login}</option>
                            })
                        }
                    </select><br/>
                    <button className="btn btn-default" onClick={this.onClickButton}>Save</button>

                </div>
            );
        } else {
            return (
                <button onClick={this.displayProjectForm} className="btn btn-default">Add project</button>
            );
        }
    }

    addDeveloper(id) {
        this.setState({addField: true, idProject: id});
    }


    developerField(id, developers) {
        if(this.state.addField) {
            if(developers.length !== this.state.developers.length && id === this.state.idProject) {
                return (
                    <div>
                        <select className="form-control" onChange={this.onChangeDeveloper}>
                            {
                                this.state.developers.map((item, i) => {
                                    if(!(developers.indexOf(item.login) + 1))
                                        return <option key={i} value={item.login}>{item.login}</option>;
                                })
                            }
                        </select>
                        <button className="btn btn-default" onClick={() => this.saveDeveloper(id)}>Add</button>
                    </div>
                );
            }
        }
    }

    saveDeveloper(id) {
        this.setState({addField: false});
        let projects = this.state.items;
        let editProject;

        for(let project of projects) {
            if(project._id === id) {
                project.developers.push(this.state.newDeveloper);
                editProject = project;
            }
        }

        this.setState({items: projects});

        fetch('/api/project/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editProject)
        }).then(data => data.json()).then(res => {
            console.log(res);
        });
    }

    onChangeDeveloper(e) {
        this.setState({newDeveloper: e.target.value});
    }

    render(){
        return (
            <div className="projects-list">
                <h2>Your projects:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <td>Title project</td>
                            <td>Developers</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.items.map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td><Link to={"/tasks/"+item.title}>{item.title}</Link></td>
                                    <td>
                                        {item.developers.map((dev, i) => {
                                            return <span key={i}>{dev}, </span>;
                                        })}

                                        {this.state.role === 'manager' ? <a href="#" onClick={() => this.addDeveloper(item._id)}>+</a> : null}
                                        {this.developerField(item._id, item.developers)}
                                    </td>
                                </tr>
                                );
                        })
                    }
                    </tbody>
                </table>
                {this.renderAddProject()}
            </div>);
    }
}

module.exports = Projects;