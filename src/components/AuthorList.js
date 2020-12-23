import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {createBrowserHistory} from "history";
import BooksByAuthorList from "./BooksByAuthorList";

export class AuthorList extends Component {
    constructor(props) {
        super(props);
        this.state = {authors: [], isLoading: true};
        this.remove = this.remove.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.history.goBack();
    }

    componentDidMount() {
        const browserHistory = createBrowserHistory();
        browserHistory.replace({
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

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const authorList = this.state.authors.map(author => {
            return <Router>
                <tr key={author.id}>
                    <td style={{whiteSpace: 'nowrap'}}>
                        <Link to={"/authors/" + author.id}>{author.name}</Link>
                    </td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"/author_item/" + author.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(author.id)}>Видалити</Button>
                        </ButtonGroup>
                    </td>
                </tr>
                <Route path={"/authors/:id"} component={BooksByAuthorList}/>
            </Router>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/authors/new">Додати жанр</Button>
                    </div>
                    <h3>Список жанрів</h3>
                    <Table className="mt-4">
                        <tbody>
                        {authorList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default AuthorList