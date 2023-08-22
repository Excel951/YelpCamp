// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: "cluster-map", // container ID
	style: "mapbox://styles/mapbox/streets-v12", // style URL
	// center: [-74.5, 40], // starting position [lng, lat]
	center: campground.geometry.coordinates,
	zoom: 9, // starting zoom
});

const mapMarker = new mapboxgl.Marker()
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(`<h6>${campground.title}</h6>`)
	)
	.addTo(map);

map.addControl(new mapboxgl.NavigationControl()/*, letak kontrol (bottom-left, etc) */);
