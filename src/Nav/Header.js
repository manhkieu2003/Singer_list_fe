import React from 'react'

const Header = ({toggleModal,nbOfContacts}) => {
  return (
     <header className='header'>
        <div className='container'>
            <h3 className='title'>Danh sách ca sỹ ({nbOfContacts})</h3>
            <button onClick={()=>toggleModal(true)} className='btn'><i className='bi bi-plus-square'></i>Thêm mới ca sỹ</button>
        </div>
     </header>
  )
}

export default Header