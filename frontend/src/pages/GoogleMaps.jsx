import React, {useState,useEffect} from 'react'
import { GoogleMap,useJsApiLoader, Polyline, InfoWindow } from "@react-google-maps/api";
import { decode } from "@googlemaps/polyline-codec";

export const GoogleMaps = () => {
  const decodePolyline = (polyline) => {
    polyline = polyline.replace(/\\\\/g,"\\").replace(/\\"/g,'"')
    let result = []
    for (let point of decode(polyline)) {
      result.push({lat:point[0],lng:point[1]})
    }
    return result
  }
  
  // unescaped 
  const [path, setPath] = useState(decodePolyline("g_rlEf~cnUSSOTgFpI_A|AeFhI{BvDgBpCy@y@qAcAyAaA_EkDaE_EkGsGyK}KuHgHsCsCuB_EoAuEa@gFJ_SBqFKcGw@aFcBoE_HqJsCyDyCeDiCaCwCoDkIaN_DcDyDeCiPiHoDaBwAo@WM]i@iBkAe@YiAcAeBmBgBuAwAi@wHgAsC}@aDqBwEqEiFkFwAuAqAsAASM[Oq@Bu@Rc@f@]n@?h@ZVz@C|@i@rAEJAp@Yd@y@rA_AzAeC|DoJpOgW`c@sWnb@gMvS_E|FcFtIwClHqBtHwGnZqElTqH|ZoHfYaDbLoCjGcBtB_DnCiCrAmDhAuNtDyEvBuCnBaE~DsDjFaDpGuFlN}EbOeEnMaIpUuCpHqDdG_DpDsEjDsOrIkY~MgGbDiFvD}OtMoMbK}GxE}FbFmL`LaCfDeAvBmBfEiCbE}FhGgHxGwMdKeIpIsLfNyVnWgc@fd@_KlKoIxKaGhIuFtGgR~RiMzMaUdV_TtT{RxR}NzKoFpEkDnD{MtN{FhGwEzFaCdEoA`DcBdGmBzM{AnJaAlEuB~FiC~FiI`RoOn]oLrW}GnLsDvHqMh\{KxXqLrXuClG{CfFsOdT}CzF_BzFiErSqCdLsBbGgElJaBzCwFpJiDvGmEzJuV|j@sL~WqDxHsIlLsG`IcGhJcFxK{AhEuDhLwBlGoMxZ}DxIgPn\cP`]kPla@sG~OeE|JyFtL}F`LkItPmHzOwL~WqFhLeE`HeF~G{HlIaRrQsIrJkC`EiCdFiHhOwDpGwDbF}ChDuIjH}NjJqZhRiS`M{_@|Ugb@|WsLdHcYrPaZxPcH`EwEfDkDlDsC|DuIvMoNnTcKxOuNvTeEfGsFhFgEfC}FpB}JtBgVdFoExAmDfByOlKiEbDeC`CmOlOoPpPyCdDaCpDeEbHmFhGwPbPyb@ja@}EzCiFpCiEfDmH~GwLdLePfR{DfF{BtEcCxDgEpEmFtEgCtCuBtDyB|FcJrWuBnG}AhHy@fEo@tB_BlD{A|CkErLsGjRkBvFwAzG{@rJG|DBvXBlQEfFUrDeAlHsCxJwGdSkJbYeCbIe@hBWdBi@~B}CzJkH|SkHbT{BdGkClFwCjEuBdCuBjBaEtCuE`B{CXcB@{Gg@sJR_CIsN_BiND{CLwFf@eHjB}An@yJ`EaDhBaBbCu@zB[~AYpFqB`UgArPi@rJOP?bCY`EgAbG_CfFeCtEi@bAwArC\n@~B`CxC`C"))
  // escaped
  //const [path, setPath] = useState(decodePolyline("g_rlEf~cnUSSOTgFpI_A|AeFhI{BvDgBpCy@y@qAcAyAaA_EkDaE_EkGsGyK}KuHgHsCsCuB_EoAuEa@gFJ_SBqFKcGw@aFcBoE_HqJsCyDyCeDiCaCwCoDkIaN_DcDyDeCiPiHoDaBwAo@WM]i@iBkAe@YiAcAeBmBgBuAwAi@wHgAsC}@aDqBwEqEiFkFwAuAqAsAASM[Oq@Bu@Rc@f@]n@?h@ZVz@C|@i@rAEJAp@Yd@y@rA_AzAeC|DoJpOgW`c@sWnb@gMvS_E|FcFtIwClHqBtHwGnZqElTqH|ZoHfYaDbLoCjGcBtB_DnCiCrAmDhAuNtDyEvBuCnBaE~DsDjFaDpGuFlN}EbOeEnMaIpUuCpHqDdG_DpDsEjDsOrIkY~MgGbDiFvD}OtMoMbK}GxE}FbFmL`LaCfDeAvBmBfEiCbE}FhGgHxGwMdKeIpIsLfNyVnWgc@fd@_KlKoIxKaGhIuFtGgR~RiMzMaUdV_TtT{RxR}NzKoFpEkDnD{MtN{FhGwEzFaCdEoA`DcBdGmBzM{AnJaAlEuB~FiC~FiI`RoOn]oLrW}GnLsDvHqMh\\{KxXqLrXuClG{CfFsOdT}CzF_BzFiErSqCdLsBbGgElJaBzCwFpJiDvGmEzJuV|j@sL~WqDxHsIlLsG`IcGhJcFxK{AhEuDhLwBlGoMxZ}DxIgPn\\cP`]kPla@sG~OeE|JyFtL}F`LkItPmHzOwL~WqFhLeE`HeF~G{HlIaRrQsIrJkC`EiCdFiHhOwDpGwDbF}ChDuIjH}NjJqZhRiS`M{_@|Ugb@|WsLdHcYrPaZxPcH`EwEfDkDlDsC|DuIvMoNnTcKxOuNvTeEfGsFhFgEfC}FpB}JtBgVdFoExAmDfByOlKiEbDeC`CmOlOoPpPyCdDaCpDeEbHmFhGwPbPyb@ja@}EzCiFpCiEfDmH~GwLdLePfR{DfF{BtEcCxDgEpEmFtEgCtCuBtDyB|FcJrWuBnG}AhHy@fEo@tB_BlD{A|CkErLsGjRkBvFwAzG{@rJG|DBvXBlQEfFUrDeAlHsCxJwGdSkJbYeCbIe@hBWdBi@~B}CzJkH|SkHbT{BdGkClFwCjEuBdCuBjBaEtCuE`B{CXcB@{Gg@sJR_CIsN_BiND{CLwFf@eHjB}An@yJ`EaDhBaBbCu@zB[~AYpFqB`UgArPi@rJOP?bCY`EgAbG_CfFeCtEi@bAwArC\\n@~B`CxC`C",5));
  const [center,setCenter] = useState({ lat: 37, lng: -122 });
  const position = { lat: 33.772, lng: -117.214 }
  const [zoom,setZoom] = useState(10);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  });

  function recenter() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCenter(pos);
          setZoom(10);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      throw Error("Error: Your browser doesn't support geolocation.");
    }
  }
 return isLoaded ? (
  <div style={{width: "100vw", height: "100vh"}}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}>
          <Polyline path={path} options={{strokeColor: "#4285f4",strokeWeight: 5}}/>
      </GoogleMap>
      <button id="recenter-button" onClick={recenter}>Recenter</button>
  </div>
 ) : <></>
}