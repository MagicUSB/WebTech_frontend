import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import {createBrowserHistory} from "history";
import Select from "react-select";

export class BookList extends Component {

    browserHistory;

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            authors: [],
            genres: [],
            translators: [],
            isLoading: true,
            loadLists: true,
            currentBookId: 0,
            currentBookName: '',
            currentAuthorId: 0,
            currentAuthorName: '',
            currentGenreId: null,
            currentGenreName: '',
            currentTranslatorId: null,
            currentPublicationYear: null,
            showForm: false,
            put: false,
        };
        this.remove = this.remove.bind(this);
        this.onClickShowForm = this.onClickShowForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBookNameChange = this.handleBookNameChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }

    componentDidMount() {
        this.browserHistory = createBrowserHistory();
        this.getBooks();
        if (this.state.loadLists) {
            this.getAuthors()
                .catch(e => alert(e))
            this.getGenres()
                .catch(e => alert(e))
            this.getTranslators()
                .catch(e => alert(e))
            this.setState({loadLists: false});
        }
    }

    getBooks() {
        this.browserHistory.replace({
            pathname: '/',
            state: {
                books: [],
                isLoading: true
            }
        });
        this.setState({isLoading: true});
        fetch('api/books')
            .then(response =>
                response.json())
            .then(data => this.setState({books: data, isLoading: false}))
            .catch(e => alert(e));
    }

    async getAuthors() {
        await fetch('api/authors')
            .then(response =>
                response.json())
            .then(data => {
                const options = data.map(d => ({
                    "value": d.id,
                    "label": d.name
                }));
                this.setState({authors: options})
            })
            .catch(e => alert(e));
    }

    async getGenres() {
        await fetch('api/genres')
            .then(response =>
                response.json())
            .then(data => {
                const options = data.map(d => ({
                    "value": d.id,
                    "label": d.name
                }));
                this.setState({genres: options})
            })
            .catch(e => alert(e));
    }

    async getTranslators() {
        await fetch('api/translators')
            .then(response =>
                response.json())
            .then(data => {
                const options = data.map(d => ({
                    "value": d.id,
                    "label": d.name
                }));
                this.setState({translators: options})
            })
            .catch(e => alert(e));
    }

    async remove(id) {
        const response = await fetch(`/api/book/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            alert('Не вдалося провести видалення!');
        } else {
            let updatedBooks = [...this.state.books].filter(i => i.id !== id);
            this.setState({books: updatedBooks});
        }
    }

    onClickShowForm() {
        // On click we change our state – this will trigger our `render` method
        this.setState({showForm: true});
    }

    renderForm() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label>Назва книги: </Label>
                        <Input type="text"
                               name={"name"}
                               onChange={this.handleBookNameChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Автор: </Label>
                        <Select id={"author_select"}
                                options={this.state.authors}
                                onChange={selectedValue => {
                                    this.setState({
                                        currentAuthorId: selectedValue.value,
                                        currentAuthorName: selectedValue.label
                                    })
                                }}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Жанр: </Label>
                        <Select id={"genre_select"}
                                options={this.state.genres}
                                onChange={selectedValue => {
                                    this.setState({
                                        currentGenreId: selectedValue.value,
                                        currentGenreName: selectedValue.label
                                    })
                                }}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Перекладач: </Label>
                        <Select id={"translator_select"}
                                options={this.state.translators}
                                onChange={selectedValue => {
                                    this.setState({
                                        currentTranslatorId: selectedValue.value,
                                        currentTranslatorName: selectedValue.label,
                                    })
                                }}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Рік видання: </Label>
                        <Input type="text"
                               name={"name"}
                               onChange={this.handleYearChange}/>
                    </FormGroup>
                    <Button type={"submit"}>Відправити</Button>
                </Form>
            </Container>
        );
    }

    handleBookNameChange(e) {
        this.setState({currentBookName: e.target.value});
    }

    handleYearChange(e) {
        this.setState({currentPublicationYear: e.target.value});
    }

    handleSubmit(event) {
        this.browserHistory.replace({
            pathname: '/'
        });
        const data = {
            book_name: this.state.currentBookName,
            author_id: this.state.currentAuthorId,
            genre_id: this.state.currentGenreId,
            translator_id: this.state.currentTranslatorId,
            year_of_publication: this.state.currentPublicationYear
        };
        if (this.state.put) {
            fetch(`api/book/${this.state.currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                let index = [...this.state.books].findIndex(i => i.id === this.state.currentBookId);
                let items = [...this.state.books];
                let item = {...items[index]};
                item.Назва = this.state.currentBookName;
                item.Автор = this.state.currentAuthorName;
                item.Жанр = this.state.currentGenreName;
                item.Перекладач = this.state.currentTranslatorName;
                item.Виданий = this.state.currentPublicationYear;
                items[index] = item;
                this.setState({books: items});
            }).catch(() => alert('Не вдалося провести редагування!'))
        } else {
            fetch('api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response =>
                    response.json())
                .then((data) => {
                    let updatedBooks = [...this.state.books].concat({
                        id: data.id,
                        Назва: this.state.currentBookName,
                        Автор: this.state.currentAuthorName,
                        Жанр: this.state.currentGenreName,
                        Перекладач: this.state.currentTranslatorName,
                        Виданий: this.state.currentPublicationYear
                    });
                    this.setState({books: updatedBooks});
                })
                .catch(e => alert(e));
        }
        this.setState({
            showForm: false, put: false,
        });
        this.setState({
            currentGenreId: null,
            currentGenreName: '',
            currentTranslatorId: null,
            currentPublicationYear: null,
        })
        event.preventDefault();
    }

    render() {
        const {isLoading} = this.state;
        const {showForm} = this.state;
        if (isLoading) {
            return <p>Завантаження...</p>;
        }

        const bookList = this.state.books.map(book => {
            return <tr key={book.id}>
                <td style={{whiteSpace: 'nowrap'}}>
                    {book.Назва}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {book.Автор}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {book.Жанр}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {book.Перекладач}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {book.Виданий}
                </td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary"
                                onClick={() => {
                                    this.onClickShowForm();
                                    this.setState({put: true, currentBookId: book.id})
                                }}>
                            Редагувати
                        </Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(book.id)}>Видалити</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button id="addButton" color="success" onClick={this.onClickShowForm}>Додати книгу</Button>
                    </div>
                    <h3>Список книг</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Автор</th>
                            <th>Жанр</th>
                            <th>Перекладач</th>
                            <th>Рік видання</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookList}
                        </tbody>
                    </Table>
                </Container>
                {showForm && this.renderForm()}
            </div>
        );
    }
}

export default BookList;