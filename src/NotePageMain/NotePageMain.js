import React, {Component} from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import {findNote} from '../notes-helpers'
import NoteContext from '../NoteContext'
import PropTypes from 'prop-types'

export default class NotePageMain extends Component {
  static contextType = NoteContext
  render() {
    console.log(this.props);
    
    const {noteId} = this.props.match.params
    const note = findNote(this.context.notes, noteId)
    if (this.context.notes.length === 0) {
      return <div>No notes</div>
    }
    return (
      <section className='NotePageMain'>
        <Note
          id={note.id}
          name={note.title}
          modified={note.date_published}
          handleDelete={this.context.handleDelete}
          folder_id={note.folder_id}
        />
        <div className='NotePageMain__content'>
          {note.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
      </section>
    )
  }

}

NotePageMain.defaultProps = {
  note: {
    content: '',
  }
}

NotePageMain.propTypes = {
  noteId: PropTypes.string.isRequired
}