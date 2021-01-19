import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table, Label, Form} from 'reactstrap';
import {Link} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Route, BrowserRouter as Router} from "react-router-dom";
import BooksByGenreList from "./BooksByGenreList";

class GenreList extends Component {
    browserHistory;

    constructor(props) {
        super(props);
        this.state = {
            genres: [],
            isLoading: true,
            showForm: false,
            put: false,
            currentId: 0,
        };
        this.remove = this.remove.bind(this);
        this.goBack = this.goBack.bind(this);
        this.onClickShowForm = this.onClickShowForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    onClickShowForm() {
        // On click we change our state – this will trigger our `render` method
        this.setState({showForm: true});
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handleSubmit(event) {

        this.browserHistory.replace({
            pathname: '/'
        });
        //PUT
        if (this.state.put) {
            const data = {
                name: this.state.name
            };
            fetch(`/api/genre_item/${this.state.currentId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                let index = [...this.state.genres].findIndex(i => i.id === this.state.currentId);
                let items = [...this.state.genres];
                let item = {...items[index]};
                item.name = data.name;
                items[index] = item;
                this.setState({genres: items});
            }).catch(() => alert('Не вдалося провести редагування!'))
        }
        //POST
        else {
            const data = {
                name: this.state.name
            };
            fetch('api/genre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response =>
                    response.json())
                .then(data => {
                    let updatedGenres = [...this.state.genres].concat(data);
                    this.setState({genres: updatedGenres});
                })
                .catch(e => alert(e));
        }
        this.setState({showForm: false, put: false});
        event.preventDefault();
    }

    renderForm() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Label>Назва жанру: </Label>
                    <input type="text" name={"name"} value={this.state.name} onChange={this.handleNameChange}/>
                    <Button type={"submit"}>Відправити</Button>
                </Form>
            </div>
        );
    }

    goBack() {
        this.props.history.goBack();
    }

    componentDidMount() {
        this.browserHistory = createBrowserHistory();
        this.browserHistory.replace({
            pathname: '/',
            state: {
                genres: [],
                isLoading: true
            }
        });
        this.setState({isLoading: true});
        fetch('api/genres')
            .then(response =>
                response.json())
            .then(data => this.setState({genres: data, isLoading: false}))
            .catch(e => alert(e));
    }

    async remove(id) {
        const response = await fetch(`/api/genre_item/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            alert('Не вдалося провести видалення!');
        } else {
            let updatedGenres = [...this.state.genres].filter(i => i.id !== id);
            this.setState({genres: updatedGenres});
        }
    }

    render() {
        const {isLoading} = this.state;
        const {showForm} = this.state;

        if (isLoading) {
            return <p>Завантаження...</p>;
        }

        const genreList = this.state.genres.map(genre => {
            return <Router>
                <tr key={genre.id}>
                    <td style={{whiteSpace: 'nowrap'}}>
                        <Link to={"/genres/" + genre.id}>{genre.name}</Link>
                    </td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/genre_item/" + genre.id}
                                    onClick={() => {
                                        this.onClickShowForm();
                                        this.setState({put: true, currentId: genre.id})
                                    }}>Редагувати</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(genre.id)}>Видалити</Button>
                        </ButtonGroup>
                    </td>
                    <td>{showForm && this.state.put && genre.id === this.state.currentId && this.renderForm()}</td>
                </tr>
                <Route path={"/genres/:id"} component={BooksByGenreList}/>
            </Router>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={this.onClickShowForm}>Додати жанр</Button>
                    </div>
                    <h3>Список жанрів</h3>
                    <Table className="mt-4">
                        <tbody>
                        {genreList}
                        </tbody>
                    </Table>
                </Container>
                {showForm && this.renderForm()}
            </div>
        );
    }
}

export default GenreList;