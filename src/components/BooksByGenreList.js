import {createBrowserHistory} from 'history';
import BookList from "./BookList";

class BooksByGenreList extends BookList {

    componentDidMount() {
        this.browserHistory = createBrowserHistory();
        this.browserHistory.replace({
            pathname: '/',
            state: {books: [], isLoading: true}
        });
        this.setState({isLoading: true});
        const {id} = this.props.match.params;
        fetch(`api/genre/${id}`)
            .then(response =>
                response.json())
            .then(data => this.setState({books: data, isLoading: false}))
            .catch(e => alert(e));
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

}

export default BooksByGenreList