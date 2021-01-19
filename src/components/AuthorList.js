import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Form, Label, Table} from 'reactstrap';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {createBrowserHistory} from "history";
import BooksByAuthorList from "./BooksByAuthorList";

export class AuthorList extends Component {

    browserHistory;

    constructor(props) {
        super(props);
        this.state = {
            authors: [],
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

    goBack() {
        this.props.history.goBack();
    }

    onClickShowForm() {
        // On click we change our state – this will trigger our `render` method
        this.setState({showForm: true});
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handleSubmit(event) {
        //PUT
        this.browserHistory.replace({
            pathname: '/'
        });
        if (this.state.put) {

            const data = {
                name: this.state.name
            };
            fetch(`/api/author_item/${this.state.currentId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                let index = [...this.state.authors].findIndex(i => i.id === this.state.currentId);
                let items = [...this.state.authors];
                let item = {...items[index]};
                item.name = data.name;
                items[index] = item;
                this.setState({authors: items});
            }).catch(() => alert('Не вдалося провести редагування!'))
        }
        //POST
        else {
            const data = {
                name: this.state.name
            };
            fetch('api/author', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response =>
                    response.json())
                .then(data => {
                    let updatedAuthors = [...this.state.authors].concat(data);
                    this.setState({authors: updatedAuthors});
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
                    <Label>Ім'я автора: </Label>
                    <input type="text" name={"name"} onChange={this.handleNameChange}/>
                    <Button type={"submit"}>Відправити</Button>
                </Form>
            </div>
        );
    }

    componentDidMount() {
        this.browserHistory = createBrowserHistory();
        this.browserHistory.replace({
            pathname: '/',
            state: {authors: [], isLoading: true}
        });
        this.setState({isLoading: true});

        fetch('api/authors')
            .then(response =>
                response.json())
            .then(data => this.setState({authors: data, isLoading: false}))
            .catch(e => alert(e));
    }

    async remove(id) {
        const response = await fetch(`/api/author_item/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            alert('Не вдалося провести видалення!');
        } else {
            let updatedAuthors = [...this.state.authors].filter(i => i.id !== id);
            this.setState({authors: updatedAuthors});
        }
    }

    render() {
        const {isLoading} = this.state;
        const {showForm} = this.state;

        if (isLoading) {
            return <p>Завантаження...</p>;
        }

        const authorList = this.state.authors.map(author => {
            return <Router>
                <tr key={author.id}>
                    <td style={{whiteSpace: 'nowrap'}}>
                        <Link to={"/authors/" + author.id}>{author.name}</Link>
                    </td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"/author_item/" + author.id}
                                    onClick={() => {
                                        this.onClickShowForm();
                                        this.setState({put: true, currentId: author.id})
                                    }}>Редагувати</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(author.id)}>Видалити</Button>
                        </ButtonGroup>
                    </td>
                    <td>{showForm && this.state.put && author.id === this.state.currentId && this.renderForm()}</td>
                </tr>
                <Route path={"/authors/:id"} component={BooksByAuthorList}/>
            </Router>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={this.onClickShowForm}>Додати автора</Button>
                    </div>
                    <h3>Список авторів</h3>
                    <Table className="mt-4">
                        <tbody>
                        {authorList}
                        </tbody>
                    </Table>
                </Container>
                {showForm && this.renderForm()}
            </div>
        );
    }
}

export default AuthorList