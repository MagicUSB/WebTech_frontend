import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import {Link} from 'react-router-dom';

export class BookList extends Component {

    constructor(props) {
        super(props);
        this.state = {books: [], isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        fetch('api/books')
            .then(response =>
                response.json())
            .then(data => this.setState({books: data, isLoading: false}))
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
        }
        else {
            let updatedBooks = [...this.state.books].filter(i => i.id !== id);
            this.setState({books: updatedBooks});
        }
    }

    render() {
        const {customers: books, isLoading} = this.state;
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
                        {/*<Button size="sm" color="primary" tag={Link} to={"/books/" + book.id}>Редагувати</Button>*/}
                        <Button size="sm" color="danger" onClick={() => this.remove(book.id)}>Видалити</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/books/new">Додати книгу</Button>
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
            </div>
        );
    }
}

export default BookList;