import React, {Component} from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddFolder.css'
import NoteContext from '../NoteContext'

class AddFolder extends Component {
    constructor() {
        super()
        this.state = {
            error: null,
            name: '',
            nameValid: false,
            validationMessage: ''
        }
    }

    static contextType = NoteContext

    isNameValid = event => {
        event.preventDefault()
        if(!this.state.name) {
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
                name: this.state.name
            })
        }
        console.log(options)
        fetch('http://localhost:9090/folders', options)
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
        this.setState({ name: letter })
    }

    render() {
        return (
            <section className='AddFolder'>
                <h2>Create a folder</h2>
                <NotefulForm
                    onSubmit={event => {
                        this.isNameValid(event)
                    }}
                >
                    <div className='field'>
                        <label htmlFor='folder-name-input'>Name</label>
                        <input 
                            type='text'
                            id='folder-name-input'
                            name='folder'
                            onChange={event => this.nameChange(event.target.value)}
                        />
                        {!this.state.nameValid && (
                            <div>
                                <p>{this.state.validationMessage}</p>
                            </div>
                        )}
                    </div>
                    <div className='buttons'>
                        <button type='submit'>Add folder</button>
                    </div>
                </NotefulForm>
                {this.state.error && (
                    <div>
                        <p>{this.state.error}</p>
                    </div>
                )}
            </section>
        )
    }
}

export default AddFolder