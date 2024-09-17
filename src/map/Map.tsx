import "leaflet/dist/leaflet.css";

import Leaflet from 'leaflet'
import {  useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { getRandomCoordinates } from '@/helpers/mapHelper';


// function viewerGeoLocation(setCoOrds: any, setLocationStaus: any) {
//   // For Gaza residents to use: Production location uploader
//   setLocationStaus(0)
//   let co_ords: any = {}
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       co_ords = { lat: position.coords.latitude, long: position.coords.longitude }
//       setCoOrds(co_ords)
//       setTimeout(() => {
//         //loading animation
//         setLocationStaus(2)
//       }, 500)

//     },
//     (error) => {

//       console.error('Error getting user location:', error);
//     }
//   );

// }

export function Map() {

  const user = useQuery(api.users.viewer);
  console.log(user, "user object")

  const postNeeds = useMutation(api.needs.sendNeeds);
  const getNeeds = useQuery(api.needs.listNeeds)
  const getAssists = useQuery(api.assists.listAssists)
  const postAssists = useMutation(api.assists.sendAssists)

  const [locationStatus, setLocationStaus] = useState<number>(0);
  const [CoOrds, setCoOrds] = useState<{ lat: number, lng: number } | null>(null)
  const [showNeedForm, setShowNeedForm] = useState<boolean>(false);
  const [showAssistForm, setShowAssistForm] = useState<boolean>(false);

  const [need, setNeed] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Define the bounding box (southwest, northeast coordinates)
  const bounds: any = [
    [31.0, 34.0], // Southwest corner [lat, lng]
    [32.0, 35.0]  // Northeast corner [lat, lng]
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user && showNeedForm) {
      const userId: Id<"users"> = user._id
      console.log(CoOrds, "new co-ordinates")
      postNeeds({
        name,
        email,
        phone,
        need: "food",
        userId: userId,
        long: CoOrds ? CoOrds.lng : 0,
        lat: CoOrds ? CoOrds.lat : 0,
        need_met: false
      })
      setShowNeedForm(false)
      setLocationStaus(0)
      setCoOrds(null)
    } else if (user && showAssistForm) {
      const userId: Id<"users"> = user._id
      postAssists({
        name,
        email,
        phone,
        need: "food",
        userId: userId,
        long: CoOrds ? CoOrds.lng : 0,
        lat: CoOrds ? CoOrds.lat : 0,
        assist_used: false
      })
      setShowAssistForm(false)
      setLocationStaus(0)
      setCoOrds(null)
    } else {
      setCoOrds(null)
      setLocationStaus(0)
      console.warn("no co-ordinates yet: re-submit")
    }
  }

  const createCustomIcon = (profilePictureUrl: string, color: string) => {
    const iconHtml = `
   <div style="width: 40px; height: 40px; position: relative; margin-top:-20px;">
      <div style="background-color: ${color}; border-radius: 50%; width: 40px; height: 40px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
        <img src="${profilePictureUrl}" style="width: 80%; height: 80%; border-radius: 50%; object-fit: cover; z-index:2">
      </div>
      <div style="width: 0; height: 0; border-left: 18px solid transparent; border-right: 18px solid transparent; border-top: 20px solid ${color}; position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%);"></div>
      
    </div>
  `;

    const customIcon = Leaflet.divIcon({
      className: "custom-icon",
      html: iconHtml,
      iconSize: [40, 60],
    });

    return customIcon;
  };

  return (<div className='leaflet-container relative h-full'>
    {
      user &&
      <>
        <MapContainer center={[31.4067, 34.3933]} zoom={10} scrollWheelZoom={false}
          className='h-full'
          minZoom={10}
          maxBounds={bounds}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            getNeeds && getNeeds.map((need, index) => {
              const customIcon = createCustomIcon(
                "/help.png",
                "blue"
              );
              return (
                <Marker  position={[need.lat, need.long]} key={"marker-" + index}
                icon={customIcon}
             
                >
                  <Popup>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start", gap:"0"}}>
                      <p className="m-0">{need.name}'s in need of<br></br> <b className="text-green-500">{need.need}</b></p>
                      <h3 className="contact font-black">Contact Details</h3>
                      <p className="phone">{need.phone} <br />{need.email}</p>
                 
                    </div>
                  </Popup>
                </Marker>
              )
            })
          }
             {
            getAssists && getAssists.map((assist, index) => {
              const customIcon = createCustomIcon(
                "/shelter.png",
                "blue"
              );
              return (
                <Marker  position={[assist.lat, assist.long]} key={"marker-" + index}
                icon={customIcon}
             
                >
                  <Popup>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start", gap:"0"}}>
                      <p className="m-0">{assist.name} can help with<br></br> <b className="text-green-500">{assist.need}</b></p>
                      <h3 className="contact font-black">Contact Details</h3>
                      <p className="phone">{assist.phone} <br />{assist.email}</p>
                 
                    </div>
                  </Popup>
                </Marker>
              )
            })
          }
        </MapContainer>

        <div className="button-group" style={{ zIndex: 100 }}>
          {
            (!showNeedForm && !showAssistForm) && <>
              <button className="submit-need-form" onClick={() => {
                setLocationStaus(0)
                setShowNeedForm(true)
              }}>Need</button>
              <button className="submit-assist-form" onClick={() => setShowAssistForm(true)}>Assist</button>
            </>
          }

          {
            showNeedForm &&
            <form className='form flex flex-col bg-white shadow-md rounded px-8 py-4' onSubmit={handleSubmit}>
              <button onClick={() => setShowNeedForm(false)} className='text-blue-900 mx-auto underline'>close</button>
              <input className='my-2 p-2' type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className='my-2 p-2' type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className='my-2 p-2' type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <select className='my-2 p-2' value={need} onChange={(e) => setNeed(e.target.value)}>
                <option value="food">Food</option>
                <option value="shelter">Shelter</option>
                <option value="water">Water</option>
                <option value="security">Food</option>
              </select>
              <img src="/map.png" alt="map-icon"
                onClick={() => {
                  getRandomCoordinates(bounds, setCoOrds, setLocationStaus)
                }}
                className="upload-location w-8 mx-auto cursor-pointer" />

              <p className={(locationStatus === 0) ? 'text-blue-900 mx-auto'
                : (locationStatus === 1) ? 'text-yellow-800 mx-auto'
                  : 'text-green-600 mx-auto'}>

                {(locationStatus === 0) ? 'upload-location'
                  : (locationStatus === 1) ? 'uploading ...'
                    : 'location uploaded'}
              </p>

              <button type="submit" disabled={(CoOrds?.lng === 0 && CoOrds?.lat === 0) ? true : false}
                className='class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Share Need</button>
            </form>
          }
          {
            showAssistForm &&
            <form className='form flex flex-col bg-white shadow-md rounded px-8 py-4' onSubmit={handleSubmit}>
              <button onClick={() => {setShowAssistForm(false)}} className='text-blue-900 mx-auto underline'>close</button>
              <input className='my-2 p-2' type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className='my-2 p-2' type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className='my-2 p-2' type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <select className='my-2 p-2' value={need} onChange={(e) => setNeed(e.target.value)}>
                <option value="food">Food</option>
                <option value="shelter">Shelter</option>
                <option value="water">Water</option>
                <option value="security">Food</option>
              </select>
              <img src="/map.png" alt="map-icon"
                onClick={() => {
                  getRandomCoordinates(bounds, setCoOrds, setLocationStaus)
                }}
                className="upload-location w-8 mx-auto cursor-pointer" />

              <p className={(locationStatus === 0) ? 'text-blue-900 mx-auto'
                : (locationStatus === 1) ? 'text-yellow-800 mx-auto'
                  : 'text-green-600 mx-auto'}>

                {(locationStatus === 0) ? 'upload-location'
                  : (locationStatus === 1) ? 'uploading ...'
                    : 'location uploaded'}
              </p>

              <button type="submit" disabled={(CoOrds?.lng === 0 && CoOrds?.lat === 0) ? true : false}
                className='class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Share Assist</button>
            </form>
          }
        </div>
      </>
    }

  </div >
  );
}
