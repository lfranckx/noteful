import React, {Component} from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NoteContext from '../NoteContext'
import config from '../config'
import './AddNote.css'

export default class AddNote extends Component {
    constructor() {
        super()
        this.state = {
            error: null,
            name: '',
            content: '',
            id: '',
            nameValid: false,
            idValid: false,
            validationMessage: ''
        }
    }
    static contextType = NoteContext
    static defaultProps = {
        folders: []
    }

    isNameValid =  event => {
        event.preventDefault()
        if (!this.state.name) {
            this.setState({
                validationMessage: "Note name cannot be blank."
            })
        } else if (this.state.id) {
            this.setState({
                validationMessage: '',
                nameValid: true
            }, 
            () => {this.handleAddNote()}
            )
        }
    }

    handleAddNote = () => {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.name,
                modified: new Date(),
                folderId: this.state.id,
                content: this.state.content
            })
        }
        
        fetch(`${config.API_ENDPOINT}/notes`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong.')
                }
                return response
            })
            .then(response => response.json())
            .then(data => {
                this.context.handleAddNote(data)
            })
            .catch(error => {
                this.setState({error: error.message})
            })
    }

    nameChange = letter => {
        this.setState({ name: letter })
    }

    contentChange = letter => {
        this.setState({ content: letter })
    }

    idChange = letter => {
        this.setState({ id: letter })
    }

    render() {
        return(
            <section className="AddNote">
                <h2 className="add-note-title">Create a note</h2>
                <NotefulForm 
                    onSubmit={event => {
                        this.isNameValid(event)
                    }}
                >
                    <div className='field'>
                        <label className='note-name-input'>Name</label>
                        <input 
                            type='text'
                            id='note-name-input'
                            name='note'
                            onChange={event => {
                                this.nameChange(event.target.value)
                            }}
                        />
                    </div>
                    {!this.state.nameValid && (
                        <div>
                            <p className="error-message">{this.state.validationMessage}</p>
                        </div>
                    )}
                    <div className='field'>
                        <label htmlFor='note-content-input'>Content</label>
                        <textarea 
                            id='note-content-input'
                            name='content'
                            onChange={event => {
                                this.contentChange(event.target.value)
                            }}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>Folder</label>
                        <select 
                            id='note-folder-select'
                            name='folder'
                            onChange={event => {
                                this.idChange(event.target.value)
                            }}
                        >
                            <option value={null}>...</option>
                            {this.context.folders.map(folder => (
                                <option key={folder.name} name='folder' value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                        {!this.state.nameValid && (
                            <div>
                                <p className="error-message">{this.state.validationMessage}</p>
                            </div>
                        )}
                    </div>
                    <div className='buttons'>
                        <button type='submit'>Add note</button>
                    </div>
                </NotefulForm>
                {this.state.error && (
                    <div>
                        <p className="error-message">{this.state.error}</p>
                    </div>
                )}
            </section>
        )
    }

}