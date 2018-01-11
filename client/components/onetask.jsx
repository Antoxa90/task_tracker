import React from 'react';

class Onetask extends React.Component {
    constructor(props) {
        super(props);
        this.project = this.props.match.params.project;
        this.taskId = this.props.match.params.task;

        this.state = {task: {}, comments: [], developers: [], mode: 'read', editComment: false, idEditComment: ''};

        this.onEdit = this.onEdit.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeTimeCosts = this.onChangeTimeCosts.bind(this);
        this.onChangeTextComment = this.onChangeTextComment.bind(this);
        this.addComment = this.addComment.bind(this);
        this.onDeleteComment = this.onDeleteComment.bind(this);
        this.onChangeDeveloper = this.onChangeDeveloper.bind(this);
        this.onEditComment = this.onEditComment.bind(this);
        this.onEditTextComment = this.onEditTextComment.bind(this);
        this.saveEditComment = this.saveEditComment.bind(this);

        this.getTaskData();
        this.getComments();
        this.getDevelopersList();
    }

    getTaskData() {
        fetch('/api/task/' + this.taskId)
            .then(res => res.json())
            .then(data => {
                this.setState({task: data.task});
            })
    }

    getComments() {
        fetch('/api/comments/' + this.taskId)
            .then(res => res.json())
            .then(data => {
                this.setState({comments: data.listComments});
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

    renderContent() {
        if(this.state.mode === 'read') {
            return (
                <div className="one-task">
                    <div className="title-one-task">
                        <label>Task title:</label>
                        <p>{this.state.task.title}</p>
                    </div>

                    <div className="description-one-task">
                        <label>Description:</label>
                        <p>{this.state.task.description}</p>
                    </div>

                    <div className="status-one-task">
                        <label>Status: </label>
                        <p>{this.state.task.status}</p>
                    </div>

                    <div className="time-costs-one-task">
                        <label>Time costs:</label>
                        <p>{this.state.task.timeCosts}</p>
                    </div>

                    <div className="developer-one-task">
                        <label>Developer:</label>
                        <p>{this.state.task.developer}</p>
                    </div>

                    <button className="btn btn-default" onClick={this.onEdit}>Edit</button>
                </div>
            );
        } else {
            return (
                <div className="one-task">
                    <div className="title-one-task">
                        <label>Task title:</label>
                        <input type="text" className="form-control" value={this.state.task.title} onChange={this.onChangeTitle} />
                    </div>

                    <div className="description-one-task">
                        <label>Description:</label><br/>
                        <input type="text" className="form-control" onChange={this.onChangeDescription} value={this.state.task.description} />
                    </div>

                    <div className="status-one-task">
                        <label>Status: </label>
                        <select value={this.state.task.status} className="form-control" onChange={this.onChangeStatus}>
                            <option value="waiting">Waiting</option>
                            <option value="implementation">Implementation</option>
                            <option value="verifying">Verifying</option>
                            <option value="releasing">Releasing</option>
                        </select>
                    </div>

                    <div className="time-costs-one-task">
                        <label>Time costs:</label>
                        <input type="number" className="form-control" value={this.state.task.timeCosts} onChange={this.onChangeTimeCosts} />
                    </div>

                    <div className="developer-one-task">
                        <label>Developer:</label>
                        <select value={this.state.task.developer} onChange={this.onChangeDeveloper} className="form-control">
                            {
                                this.state.developers.map((item, i) => {
                                    return <option value={item.login} key={i}>{item.login}</option>;
                                })
                            }
                        </select>
                    </div>

                    <button className="btn btn-default" onClick={this.onSave}>Save</button>
                </div>
            );
        }
    }

    renderComment() {
        return (
            <div className="task-comments">
                <h2>Comments</h2><br/>
                <div className="add-comment-form">
                    <h2>{localStorage.getItem('login')}</h2>
                    <textarea className="form-control" onChange={this.onChangeTextComment} placeholder="Add task comment"></textarea>
                    <button className="btn btn-default" onClick={this.addComment}>Add comment</button>
                </div>

                {
                    this.state.comments.map((item, i) => {
                        return (
                            <div className="one-comment" key={i}>
                                <div>
                                    <p><strong>
                                        {item.author} {item.update_at.toString()} {this.deleteLink(item.author, item._id)} {this.editLink(item.author, item._id)}
                                    </strong></p>

                                    {this.renderCommnentMessage(item)}
                                    <p></p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderCommnentMessage(comment) {
        if(this.state.idEditComment === comment._id && this.state.editComment) {
            return (
                <div>
                    <textarea type="text" value={comment.text} className="form-control" onChange={this.onEditTextComment}></textarea>
                    <button className="btn btn-default" onClick={this.saveEditComment}>Save</button>
                </div>
            );
        } else {
            return (
                <div>{comment.text}</div>
            );
        }
    }

    onEditTextComment(e) {
        let comments = this.state.comments;
        for(let comment of comments) {
            if(comment._id === this.state.idEditComment) {
                comment.text = e.target.value;
                this.setState({newComment: comment});
            }
        }

        this.setState({comments: comments});
    }

    saveEditComment() {
        this.setState({editComment: false});

        fetch('/api/comment/' + this.state.idEditComment, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.newComment)
        }).then(data => data.json()).then(res => {
        });
    }

    onEdit() {
        this.setState({mode: 'edit'});
    }

    onSave() {
        this.setState({mode: 'read'});

        fetch('/api/task/' + this.state.task._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.task)
        }).then(data => data.json()).then(res => {
        });
    }

    deleteLink(author, id) {
        if(author === localStorage.getItem('login')) {
            return (
                <a href="#" onClick={() => this.onDeleteComment(id)}>delete</a>
            );
        }
    }

    editLink(author, id) {
        if(author === localStorage.getItem('login')) {
            return (
                <a href="#" onClick={() => this.onEditComment(id)}>edit</a>
            );
        }
    }

    onDeleteComment(id) {
        let comments = this.state.comments;
        let newComments = [];
        for(let comment of comments) {
            if(comment._id !== id)
                newComments.push(comment);
        }

        this.setState({comments: newComments});

        fetch('/api/comment/' + id, {
            method: 'DELETE'
        }).then(data => data.json()).then(res => {
            console.log(res);
        });
    }

    onEditComment(id) {
        this.setState({idEditComment: id, editComment: true});
    }

    onChangeDescription(e) {
        let task = this.state.task;
        task.description = e.target.value;
        this.setState({task: task});
    }

    onChangeStatus(e) {
        let task = this.state.task;
        task.status = e.target.value;
        this.setState({task: task});
    }

    onChangeTitle(e) {
        let task = this.state.task;
        task.title = e.target.value;
        this.setState({task: task});
    }

    onChangeTimeCosts(e) {
        let task = this.state.task;
        task.timeCosts = +e.target.value;
        this.setState({task: task});
    }

    onChangeTextComment(e) {
        this.setState({textComment: e.target.value});
    }

    onChangeDeveloper(e) {
        let task = this.state.task;
        task.developer = e.target.value;
        this.setState({task: task});
    }

    addComment() {
        let object = {
            text: this.state.textComment,
            author: localStorage.getItem('login'),
            task: this.taskId,
            update_at: new Date()
        };

        fetch('/api/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(data => data.json()).then(res => {
            object._id = res.id;
            this.setState({comments: [...this.state.comments, object]});
        });
    }

    render() {
        return (
            <div>
                {this.renderContent()}
                {this.renderComment()}
            </div>
        );
    }
}

module.exports = Onetask;