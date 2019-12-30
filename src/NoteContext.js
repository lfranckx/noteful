import React from 'react'

const NoteContext = React.createContext({
    notes: [],
    folders: [],
    error: null,
    handleDelete: () => {},
    handelAddFolder: () => {},
    handleAddNote: () => {}
})

export default NoteContext