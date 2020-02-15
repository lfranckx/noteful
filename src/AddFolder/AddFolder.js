import React, {Component} from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddFolder.css'
import config from '../config'
import NoteContext from '../NoteContext'

class AddFolder extends Component {
    constructor() {
        super()
        this.state = {
            error: null,
            id: '',
            folder_name: '',
            nameValid: false,
            validationMessage: ''
        }
    }

    static contextType = NoteContext

    isNameValid = event => {
        event.preventDefault()
        if(!this.state.folder_name) {
            this.setState({
                validationMessage: 'Folder name cannot be blank.',
                nameValid: false
            })
        } else {
            this.setState({
                validationMessage: '',
                nameValid: true
            },
            this.handleAddFolder())
        }
    }

    handleAddFolder = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folder_name: this.state.folder_name
            })
        }
        console.log(options)
        fetch(`${config.API_ENDPOINT}/api/folders`, options)
        .then(response => {
            if(!response.ok) {
                throw new Error('Something went wrong.')
            }
            return response
        })
        .then(response => response.json())
        .then(data => {
            this.context.handleAddFolder(data)
        })
        .catch(error => {
            this.setState({
                error: error.message
            })
        })
    }

    nameChange = letter => {
        this.setState({ folder_name: letter })
    }

    render() {
        return (
            <section className='AddFolder'>
                <h2 className="add-folder-title">Create a folder</h2>
                <NotefulForm
                    onSubmit={event => {
                        this.isNameValid(event)
                    }}
                >
                    <div className='field'>
                        <label className="name" htmlFor='folder-name-input'>Name</label>
                        <input 
                            type='text'
                            id='folder-name-input'
                            name='folder'
                            onChange={event => this.nameChange(event.target.value)}
                        />
                        {!this.state.nameValid && (
                            <div>
                                <p className="error-message">{this.state.validationMessage}</p>
                            </div>
                        )}
                    </div>
                    <div className='buttons'>
                        <button type='submit'>Add folder</button>
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

export default AddFolder