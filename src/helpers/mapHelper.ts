export function getRandomCoordinates(bounds:any[][],setCoOrds: any, setLocationStaus: any): void {
    const [[latMin, lngMin], [latMax, lngMax]] = bounds;
    setLocationStaus(0)
    // Generate a random latitude and longitude within the bounds
    const randomLat:number = Math.random() * (latMax - latMin) + latMin;
    const randomLng:number = Math.random() * (lngMax - lngMin) + lngMin;
    setTimeout(() => {
        //loading animation
        setLocationStaus(2)
    },500)
  
    setCoOrds({lat:randomLat,lng:randomLng})
  }