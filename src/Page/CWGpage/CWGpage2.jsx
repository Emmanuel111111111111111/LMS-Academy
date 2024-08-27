

import '../../App.module.css'
import { CWG } from '../../Components/CWG/CWG'
import React, { useEffect, useState } from 'react'

export const CWGpage2 = () => {

  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.log(err));
  }, [])

  return (
    <>
    <div>
      <h1>HELLO</h1>
    
      {users.map((user) => (
        <p>{user.name}</p>
      ))}

    </div>
  </>
  )
}

// export default App
