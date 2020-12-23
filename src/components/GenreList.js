import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Route, BrowserRouter as Router} from "react-router-dom";
import BooksByGenreList from "./BooksByGenreList";

class GenreList extends Component {

    constructor(props) {
        super(props);
        this.state = {genres: [], isLoading: true};
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
            state: {genres: [], isLoading: true}
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

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const genreList = this.state.genres.map(genre => {
            return <Router>
                <tr key={genre.id}>
                    <td style={{whiteSpace: 'nowrap'}}>
                        <Link to={"/genres/" + genre.id}>{genre.name}</Link>
                    </td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"/genre_item/" + genre.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(genre.id)}>Видалити</Button>
                        </ButtonGroup>
                    </td>
                </tr>
                <Route path={"/genres/:id"} component={BooksByGenreList}/>
            </Router>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/genres/new">Додати жанр</Button>
                    </div>
                    <h3>Список жанрів</h3>
                    <Table className="mt-4">
                        <tbody>
                        {genreList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default GenreList;