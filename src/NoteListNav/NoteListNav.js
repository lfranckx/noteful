import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import { countNotesForFolder } from '../notes-helpers'
import './NoteListNav.css'
import NoteContext from '../NoteContext'

export default function NoteListNav() {
  return (
    <NoteContext.Consumer>
      {({ notes, folders }) => (
        <div className='NoteListNav'>
          <ul className='NoteListNav__list'>
            {folders.map(folder =>
              <li key={folder.id}>
                <NavLink
                  key={folder.id}
                  className='NoteListNav__folder-link'
                  to={`/folder/${folder.id}`}
                >
                  <span className='NoteListNav__num-notes'>
                    {countNotesForFolder(notes, folder.id)}
                  </span>
                  {folder.folder_name}
                </NavLink>
              </li>
            )}
          </ul>
          <div className='NoteListNav__button-wrapper'>
            <CircleButton
              tag={Link}
              to='/add-folder'
              type='button'
              className='NoteListNav__add-folder-button'
            >
              <FontAwesomeIcon icon='plus' />
              <br />
              Folder
            </CircleButton>
            </div>
        </div>
      )}
    </NoteContext.Consumer>
  )
}

NoteListNav.defaultProps = {
  folders: []
}
