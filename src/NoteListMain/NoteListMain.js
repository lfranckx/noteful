import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import './NoteListMain.css'
import NoteContext from '../NoteContext'
import {getNotesForFolder} from '../notes-helpers'
import PropTypes from 'prop-types'

export default class NoteListMain extends Component {
  static contextType = NoteContext
  render() {
    const {folderId} = this.props.match.params
    console.log(this.props);
    
    if (this.context.notes.length === 0) {
      return <div>No Notes</div>
    }
    return (
      <section className='NoteListMain'>
        <ul>
          {console.log(this.context.notes, folderId)}
          {getNotesForFolder(this.context.notes, folderId).map(note =>
            <li key={note.id}>
              <Note
                handleDelete={this.context.handleDelete}
                id={`${note.id}`}
                name={note.title}
                modified={note.date_published}
                folder_id={note.folder_id}
              />
            </li>
          )}
        </ul>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to='/add-note'
            type='button'
            className='NoteListMain__add-note-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Note
          </CircleButton>
        </div>
      </section>
    )
  }
}

NoteListMain.defaultProps = {
  notes: []
}

NoteListMain.propTypes = {
  folderId: PropTypes.string
}