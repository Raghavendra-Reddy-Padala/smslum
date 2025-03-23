"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search } from "lucide-react"

type Coordinates = {
  lat: number
  lng: number
}

type LocationPickerProps = {
  onLocationSelected: (location: string, coordinates: Coordinates) => void
  defaultLocation?: string
  defaultCoordinates?: Coordinates
}

export function LocationPicker({ onLocationSelected, defaultLocation = "", defaultCoordinates }: LocationPickerProps) {
  const [location, setLocation] = useState(defaultLocation)
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(defaultCoordinates)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Load Google Maps script dynamically
    // In a real app, you would use your Google Maps API key
    if (typeof window !== "undefined" && !window.google && !document.getElementById("google-maps-script")) {
      setIsMapLoaded(false)
      const script = document.createElement("script")
      script.id = "google-maps-script"
      script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"
      script.async = true
      script.defer = true
      script.onload = initMap

      document.head.appendChild(script)
    } else if (typeof window !== "undefined" && window.google) {
      initMap()
    }

    return () => {
      // Cleanup if needed
    }
  }, [])

  const initMap = () => {
    if (!mapRef.current) return

    // For demonstration purposes, we'll use a default location (New York)
    const defaultLatLng = coordinates || { lat: 40.7128, lng: -74.006 }

    const mapOptions = {
      center: defaultLatLng,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }

    // Create map instance
    const map = new window.google.maps.Map(mapRef.current, mapOptions)
    mapInstanceRef.current = map

    // Add marker
    const marker = new window.google.maps.Marker({
      position: defaultLatLng,
      map: map,
      draggable: true,
    })

    // Update coordinates when marker is dragged
    window.google.maps.event.addListener(marker, "dragend", () => {
      const position = marker.getPosition()
      if (position) {
        const newCoordinates = {
          lat: position.lat(),
          lng: position.lng(),
        }
        setCoordinates(newCoordinates)

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: newCoordinates }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address
            setLocation(address)
            onLocationSelected(address, newCoordinates)
          }
        })
      }
    })

    // Initialize places autocomplete
    const input = document.getElementById("location-input") as HTMLInputElement
    const autocomplete = new window.google.maps.places.Autocomplete(input)
    autocomplete.bindTo("bounds", map)

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()

      if (!place.geometry || !place.geometry.location) {
        return
      }

      // If the place has a geometry, then present it on a map
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport)
      } else {
        map.setCenter(place.geometry.location)
        map.setZoom(17)
      }

      marker.setPosition(place.geometry.location)

      const newCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }

      setCoordinates(newCoordinates)
      setLocation(place.formatted_address || "")
      onLocationSelected(place.formatted_address || "", newCoordinates)
    })

    setIsMapLoaded(true)
  }

  const handleSearch = () => {
    if (!mapInstanceRef.current || !location) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === "OK" && results && results[0] && results[0].geometry) {
        const position = results[0].geometry.location

        mapInstanceRef.current.setCenter(position)

        const newCoordinates = {
          lat: position.lat(),
          lng: position.lng(),
        }

        setCoordinates(newCoordinates)
        onLocationSelected(location, newCoordinates)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="location-input">Location</Label>
          <div className="flex mt-1">
            <Input
              id="location-input"
              placeholder="Enter location or drag the marker"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="button" size="icon" onClick={handleSearch} className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div ref={mapRef} className="h-[300px] w-full rounded-md border bg-muted">
        {!isMapLoaded && (
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {coordinates && (
        <div className="text-sm text-muted-foreground flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      )}
    </div>
  )
}

