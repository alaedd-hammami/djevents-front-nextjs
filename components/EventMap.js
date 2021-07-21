import { useEffect, useState } from 'react'
import Image from 'next/image'
import Geocode from 'react-geocode'
import ReactMapGL, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function EventMap({ evt }) {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '500px',
    latitude: 40.712772,
    longitude: -73.935242,
    zoom: 12,
  })

  const getCoordFromAddress = async () => {
    try {
      const res = await Geocode.fromAddress(evt.address)
      const { lat, lng } = res.results[0].geometry.location

      setLatitude(lat)
      setLongitude(lng)
      setViewport({ ...viewport, latitude: lat, longitude: lng })
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCoordFromAddress()
  }, [])

  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY)

  if (loading) return false

  console.log(latitude, longitude)
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKRN}
      onViewportChange={(vp) => setViewport(vp)}
    >
      <Marker key={evt.id} latitude={latitude} longitude={longitude}>
        <Image src="/images/pin.svg" width={30} height={30} alt="" />
      </Marker>
    </ReactMapGL>
  )
}
