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
            id: '',
            title: '',
            content: '',
            folder_id: '',
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
        if (!this.state.title) {
            this.setState({
                validationMessage: "Note name cannot be blank."
            })
        } else if (this.state.folder_id) {
            this.setState({
                validationMessage: '',
                nameValid: true
            }, 
            () => {this.handleAddNote()}
            )
        }
    }

    handleAddNote = () => {
        console.log(this.context.folders, this.context.notes)
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: this.state.title,
                content: this.state.content,
                folder_id: parseInt(this.state.folder_id),
                date_published: new Date()
            })
        }
        console.log(options.body);
        
        fetch(`${config.API_ENDPOINT}/api/notes`, options)
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
        this.setState({ title: letter })
    }

    contentChange = letter => {
        this.setState({ content: letter })
    }

    idChange = letter => {
        this.setState({ folder_id: letter })
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
                                <option key={folder.id} name='folder' value={folder.id}>
                                    {folder.folder_name}
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