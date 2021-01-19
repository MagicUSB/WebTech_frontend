import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Form, Label, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Route, BrowserRouter as Router} from "react-router-dom";
import BooksByTranslatorList from "./BooksByTranslatorList";

class TranslatorList extends Component {

    browserHistory;

    constructor(props) {
        super(props);
        this.state = {
            translators: [],
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

    renderForm() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Label>Ім'я перекладача: </Label>
                    <input type="text" name={"name"} value={this.state.name} onChange={this.handleNameChange}/>
                    <Button type={"submit"}>Відправити</Button>
                </Form>
            </div>
        );
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
            fetch(`/api/translator_item/${this.state.currentId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                let index = [...this.state.translators].findIndex(i => i.id === this.state.currentId);
                let items = [...this.state.translators];
                let item = {...items[index]};
                item.name = data.name;
                items[index] = item;
                this.setState({translators: items});
            }).catch(() => alert('Не вдалося провести редагування!'))
        }
        //POST
        else {
            const data = {
                name: this.state.name
            };
            fetch('api/translator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response =>
                    response.json())
                .then(data => {
                    let updatedTranslators = [...this.state.translators].concat(data);
                    this.setState({translators: updatedTranslators});
                })
                .catch(e => alert(e));
        }
        this.setState({showForm: false, put: false});
        event.preventDefault();
    }

    goBack() {
        this.props.history.goBack();
    }

    componentDidMount() {
        this.browserHistory = createBrowserHistory();
        this.browserHistory.replace({
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
            let updatedTranslators = [...this.state.translators].filter(i => i.id !== id);
            this.setState({translators: updatedTranslators});
        }
    }

    render() {
        const {isLoading} = this.state;
        const {showForm} = this.state;

        if (isLoading) {
            return <p>Завантаження...</p>;
        }

        const translatorList = this.state.translators.map(translator => {
            return <Router>
                <tr key={translator.id}>
                    <td style={{whiteSpace: 'nowrap'}}>
                        <Link to={"/translators/" + translator.id}>{translator.name}</Link>
                    </td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/translator_item/" + translator.id} onClick={() => {
                                this.onClickShowForm();
                                this.setState({put: true, currentId: translator.id})
                            }}>Редагувати</Button>
                            <Button size="sm" color="danger"
                                    onClick={() => this.remove(translator.id)}>Видалити</Button>
                        </ButtonGroup>
                    </td>
                    <td>{showForm && this.state.put && translator.id === this.state.currentId && this.renderForm()}</td>
                </tr>
                <Route path={"/translators/:id"} component={BooksByTranslatorList}/>
            </Router>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={this.onClickShowForm}>Додати перекладача</Button>
                    </div>
                    <h3>Список перекладачів</h3>
                    <Table className="mt-4">
                        <tbody>
                        {translatorList}
                        </tbody>
                    </Table>
                </Container>
                {showForm && this.renderForm()}
            </div>
        );
    }
}

export default TranslatorList;