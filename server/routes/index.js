let path = require('path');
let log  = require('../config/logs')(module);
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let nodemailer = require('nodemailer');

let UserModel = require('../models/user');
let ProjectModel = require('../models/project');
let TaskModel = require('../models/task');
let CommentModel = require('../models/comment');

function sendEmail(login, user, pass) {
    let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        auth: {
            user: user,
            pass: pass
        }
    });

    let mailOptions = {
        from: 'yourdomain@yandex.ru',
        to: login,
        subject: 'Confirmation email',
        text: '<a href="">Confirm email</a>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../../index.html'));
    });

    /*------------------users-------------------*/

    app.get('/api/users', (req, res) => {
        return UserModel.find(function (err, users) {
            if (!err) {
                return res.send({listUsers: users});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {

            if (err) {
                return res.send({ message: 'fail'});
            }

            if (!user) {
                return res.send({ message: 'fail'});
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.send({ message: 'success', user: user});
            });
        })(req, res, next);
    });

    app.post('/api/signup', function(req, res) {
        let user = new UserModel({
            login: req.body.login,
            password: req.body.password,
            role: req.body.role,
            emailConfirmed: req.body.emailConfirmed,
            name: req.body.name,
            surname: req.body.surname,
            lastname: req.body.lastname
        });

        user.save(function (err) {
            if (!err) {
                return res.send({ message: 'User register', status: 200 });
            } else {
                console.log(err);
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error', message: err.message, status: 400 });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error', message: err.message, status: 500 });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });

    app.get('/api/logout', function(req, res) {
        req.logOut();
        return res.send({ message: 'OK' });
    });

    app.get('/api/developers', (req, res) => {
        return UserModel.find({role: 'developer'}, function (err, users) {
            if (!err) {
                return res.send(JSON.stringify(users));
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.get('/api/users/name/:name', (req, res) => {
        return UserModel.find({name: req.params.name}, function (err, users) {
            if (!err) {
                return res.send({listUsers: users});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.get('/api/users/surname/:surname', (req, res) => {
        return UserModel.find({surname: req.params.surname}, function (err, users) {
            if (!err) {
                return res.send({listUsers: users});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.post('/api/registration', function(req, res) {
        let user = new UserModel({
            login: req.body.login,
            password: req.body.password,
            role: req.body.role,
            name: req.body.name,
            surname: req.body.surname,
            lastname: req.body.lastname
        });

        user.save(function (err, user) {
            if (!err) {

                return res.send({ message: 'User added', status: 200});
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error', message: err.message, status: 400 });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error', message: err.message, status: 500 });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });


    /*app.get('/api/confirmemail/:login', function(req, res) {
        return UserModel.find({login: req.params.login}, function (err, user) {

        });
    });*/

    /*----------------projects----------------*/

    app.get('/api/projects', (req, res) => {
        return ProjectModel.find(function (err, projects) {
            if (!err) {
                return res.send({listProjects: projects});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.post('/api/project', function(req, res) {
        let project = new ProjectModel({
            title: req.body.title,
            description: req.body.description,
            developers: req.body.developers,
            manager: req.body.manager
        });

        project.save(function (err) {
            if (!err) {
                return res.send({ message: 'Project added', status: 200 });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error', message: err.message, status: 400 });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error', message: err.message, status: 500 });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });

    app.put('/api/project/:id', function (req, res) {
        return ProjectModel.findById(req.params.id, function (err, project) {
            if(!project) {
                res.statusCode = 404;
                return res.send({ status: 404 });
            }

            project.title = req.body.title;
            project.description = req.body.description;
            project.developers = req.body.developers;
            project.manager = req.body.manager;

            return project.save(function (err) {
                if (!err) {
                    return res.send({ status: 200, project: project });
                } else {
                    if(err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });
    });

    app.get('/api/projects/developer/:developer', function(req, res) {
        return ProjectModel.find({developers: req.params.developer}, function (err, projects) {
            if (!err) {
                return res.send({ listProjects: projects });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.get('/api/projects/manager/:manager', function(req, res) {
        return ProjectModel.find({manager: req.params.manager}, function (err, projects) {
            if (!err) {
                return res.send({ listProjects: projects });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    /*------------------tasks------------------*/

    app.get('/api/task/:id', function(req, res) {
        return TaskModel.findById(req.params.id, function (err, task) {
            if (!err) {
                return res.send({ task: task });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.post('/api/task', function(req, res) {
        let task = new TaskModel({
            title: req.body.title,
            project: req.body.project,
            developer: req.body.developer,
            description: req.body.description,
            timeCosts: req.body.timeCosts,
            status: req.body.status
        });

        task.save(function (err, task) {
            if (!err) {
                return res.send({ message: 'Task added', status: 200, id: task._id });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error', message: err.message, status: 400 });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error', message: err.message, status: 500 });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });

    app.put('/api/task/:id', function (req, res) {
        return TaskModel.findById(req.params.id, function (err, task) {
            if(!task) {
                res.statusCode = 404;
                return res.send({ status: 404 });
            }

            task.title = req.body.title;
            task.project = req.body.project;
            task.developer = req.body.developer;
            task.description = req.body.description;
            task.timeCosts = req.body.timeCosts;
            task.status = req.body.status;

            return task.save(function (err) {
                if (!err) {
                    return res.send({ status: 200, task: task });
                } else {
                    if(err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });
    });

    app.get('/api/tasks/:project', function(req, res) {
        return TaskModel.find({project: req.params.project}, function (err, tasks) {
            if (!err) {
                return res.send({ listTasks: tasks });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.get('/api/tasks/developer/:developer', function(req, res) {
        return TaskModel.find({developer: req.params.developer}, function (err, tasks) {
            if (!err) {
                return res.send({ listTasks: tasks });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    /*------------------comments----------------*/

    app.get('/api/comments/:task', function(req, res) {
        return CommentModel.find({task: req.params.task}, function (err, comments) {
            if (!err) {
                return res.send({ listComments: comments });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error', message: err.message, status: 500 });
            }
        });
    });

    app.post('/api/comment', function(req, res) {
        let comment = new CommentModel({
            text: req.body.text,
            author: req.body.author,
            task: req.body.task
        });

        comment.save(function (err, com) {
            if (!err) {
                return res.send({ message: 'Comment added', status: 200, id: com._id });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error', message: err.message, status: 400 });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error', message: err.message, status: 500 });
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });

    app.put('/api/comment/:id', function (req, res) {
        return CommentModel.findById(req.params.id, function (err, comment) {
            if(!comment) {
                res.statusCode = 404;
                return res.send({ status: 404 });
            }

            comment.text = req.body.text;
            comment.author = req.body.author;
            comment.task = req.body.task;
            comment.update_at = Date.now();

            return comment.save(function (err) {
                if (!err) {
                    return res.send({ status: 200, comment: comment });
                } else {
                    if(err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });
    });

    app.delete('/api/comment/:id', function (req, res){
        return CommentModel.findById(req.params.id, function (err, comment) {
            if(!comment) {
                res.statusCode = 404;
                return res.send({ status: 404 });
            }
            return comment.remove(function (err) {
                if (!err) {
                    return res.send({ status: 200 });
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                }
            });
        });
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../../index.html'));
    });

};