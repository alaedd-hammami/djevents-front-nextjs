import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { parseCookies } from 'helpers/index'
import Layout from 'components/Layout'
import DashboardEvent from 'components/DashboardEvent'
import { API_URL } from 'config/index'
import styles from 'styles/Dashboard.module.css'
import AuthContext from 'context/AuthContext'

export default function DashboardPage({ events, token }) {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const deleteEvent = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          return toast.error('Unauthorized')
        }
        toast.error(data.message)
      } else {
        router.reload()
      }
    }
  }
  return (
    <Layout title="User Dashboard">
      <div className={styles.dash}>
        <h1>{user?.username} Dashboard</h1>
        <ToastContainer />
        <h3>My Events</h3>
        {events.length > 0 ? (
          events.map((evt) => (
            <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
          ))
        ) : (
          <p>No events created yet</p>
        )}
      </div>
    </Layout>
    //comment
  )
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req)

  const res = await fetch(`${API_URL}/events/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const events = await res.json()

  return {
    props: {
      events,
      token,
    },
  }
}
