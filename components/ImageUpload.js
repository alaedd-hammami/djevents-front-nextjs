import { useState } from 'react'
import { API_URL } from 'config/index'
import styles from 'styles/Form.module.css'

export default function ImageUpload({ evtId, imageUploaded, token }) {
  const [image, setImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('files', image)
    formdata.append('ref', 'events')
    formdata.append('refId', evtId)
    formdata.append('field', 'image')

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    })

    if (res.ok) {
      imageUploaded()
    }
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  return (
    <div className={styles.form}>
      <h1>Upload Event Image</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" onChange={handleFileChange} />
        </div>
        <input type="submit" value="Upload" className="btn" />
      </form>
    </div>
  )
}
