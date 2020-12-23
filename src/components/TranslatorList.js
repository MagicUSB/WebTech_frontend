import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Route, BrowserRouter as Router} from "react-router-dom";
import BooksByTranslatorList from "./BooksByTranslatorList";

class TranslatorList extends Component {

    constructor(props) {
        super(props);
        this.state = {translators: [], isLoading: true};
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
            state: {translators: [], isLoading: true}
        });
        this.setState({isLoading: true});

        fetch('api/translators')
            .then(response =>
                response.json())
            .then(data => this.setState({translators: data, isLoading: false}))
            .catch(e => alert(e));
    }

    async remove(id) {
        const response = await fetch(`/api/translator_item/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            alert('Не вдалося провести видалення!');
        } else {
            let updatedtranslators = [...this.state.translators].filter(i => i.id !== id);
            this.setState({translators: updatedtranslators});
        }
    }

    render() {
        const {isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const translatorList = this.state.translators.map(translator => {
            return <Router>
                <tr key={translator.id}>
                    <td style={{whiteSpace: 'nowrap'}}>
                        <Link to={"/translators/" + translator.id}>{translator.name}</Link>
                    </td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"/translator_item/" + translator.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(translator.id)}>Видалити</Button>
                        </ButtonGroup>
                    </td>
                </tr>
                <Route path={"/translators/:id"} component={BooksByTranslatorList}/>
            </Router>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/translators/new">Додати жанр</Button>
                    </div>
                    <h3>Список жанрів</h3>
                    <Table className="mt-4">
                        <tbody>
                        {translatorList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default TranslatorList;