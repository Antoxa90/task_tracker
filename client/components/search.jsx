import React from 'react';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {name: '', surname: '', developersByName: '', developersBySurname: ''};

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.searchByName = this.searchByName.bind(this);
        this.searchBySurname = this.searchBySurname.bind(this);
    }

    onChangeName(e) {
        this.setState({name: e.target.value});
    }

    onChangeSurname(e) {
        this.setState({surname: e.target.value});
    }

    searchByName() {
        fetch('/api/users/name/' + this.state.name)
            .then(res => res.json())
            .then(data => {
                console.log(data.listUsers);
                this.setState({developersByName: data.listUsers});
            })
    }

    searchBySurname() {
        fetch('/api/users/surname/' + this.state.surname)
            .then(res => res.json())
            .then(data => {
                console.log(data.listUsers);
                this.setState({developersBySurname: data.listUsers});
            })
    }

    renderResultSearch(str) {
        if(str !== '')
            return (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Surname</td>
                                <td>Lastname</td>
                                <td>Login</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                str.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item.surname}</td>
                                            <td>{item.lastname}</td>
                                            <td>{item.login}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
    }


    render(){
        return (
            <div className="search">
                <label>Search by name developer:</label>
                <input type="text" className="form-control" onChange={this.onChangeName} placeholder="Enter developer name" />
                <p><button className="btn btn-default" onClick={this.searchByName}>Search by name</button></p>

                {this.renderResultSearch(this.state.developersByName)}

                <label>Search by surname developer:</label>
                <input type="text" className="form-control" onChange={this.onChangeSurname} placeholder="Enter developer surname" />
                <button className="btn btn-default" onClick={this.searchBySurname}>Search by surname</button>

                {this.renderResultSearch(this.state.developersBySurname)}
            </div>
        );
    }
}

module.exports = Search;