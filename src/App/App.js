import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import config from '../config';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import NoteContext from '../NoteContext'
import NotefulError from '../NotefulError/NotefulError'
import {findNote, findFolder} from '../notes-helpers';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/api/notes`),
            fetch(`${config.API_ENDPOINT}/api/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    handleAddFolder = folder => {
        this.setState({
            folders: [...this.state.folders, folder]
        },
        () => this.props.history.replace('/'))
    }

    handleAddNote = note => {
        this.setState({ notes: [...this.state.notes, note] }, () =>
            this.props.history.replace('/')
        )
    }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        if (notes.length === 0) {
            return <div>No notes</div>
        }
        
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact 
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folder_id);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            return <NoteListMain
                                    {...routeProps} />
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        return <NotePageMain {...routeProps} />;
                    }}
                />
                <Route path='/add-folder' component={AddFolder} />
                <Route path='/add-note' component={AddNote} />
            </>
        );
    }

    render() {
        return (
            <NoteContext.Provider
                value={{
                    folders: this.state.folders,
                    notes: this.state.notes,
                    handleDelete: this.handleDeleteNote,
                    handleAddFolder: this.handleAddFolder,
                    handleAddNote: this.handleAddNote
                }}
            >
            <div className="App">
                <NotefulError>
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                </NotefulError>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <NotefulError>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </NotefulError>
            </div>
            </NoteContext.Provider>
        );
    }
}

export default withRouter(App);
