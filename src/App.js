import logo from './logo.svg';
import './App.css';
import {Route, BrowserRouter as Router} from "react-router-dom";
import {Nav, Navbar, NavLink} from 'reactstrap';
import React from "react";
import GenreList from './components/GenreList'
import BookList from './components/BookList'
import AuthorList from "./components/AuthorList";
import TranslatorList from "./components/TranslatorList"

function App() {
    return (
        <div className="App">
            {/*<header className="App-header">*/}
            {/*    <img src={logo} className="App-logo" alt="logo"/>*/}
            {/*    <h1>Ласкаво просимо до бібліотеки!</h1>*/}
            {/*</header>*/}
            <h1>Ласкаво просимо до бібліотеки!</h1>
            <Router>
                <Navbar>
                    <Nav>
                        <NavLink href="/books">Список книг</NavLink>
                        <NavLink href="/genres">Список жанрів</NavLink>
                        <NavLink href="/authors">Список авторів</NavLink>
                        <NavLink href="/translators">Список перекладачів</NavLink>
                    </Nav>
                </Navbar>
                <Route path="/genres" component={GenreList}/>
                <Route path="/authors" component={AuthorList}/>
                <Route path="/translators" component={TranslatorList}/>
                <Route path="/books" component={BookList}/>

            </Router>
        </div>
    );
}

export default App;
