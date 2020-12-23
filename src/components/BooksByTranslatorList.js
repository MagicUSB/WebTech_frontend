import BookList from "./BookList";
import {createBrowserHistory} from "history";

export class BooksByTranslatorList extends BookList {
    componentDidMount() {
        const browserHistory = createBrowserHistory();
        browserHistory.replace({
            pathname: '/',
            state: {books: [], isLoading: true}
        });
        this.setState({isLoading: true});
        const {id} = this.props.match.params;
        fetch(`api/translator/${id}`)
            .then(response =>
                response.json())
            .then(data => this.setState({books: data, isLoading: false}))
            .catch(e => alert(e));
    }
}

export default BooksByTranslatorList