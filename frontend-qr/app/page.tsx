'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Button } from './components/ui/button'

// Import QrScanner dynamically to avoid SSR issues
const QrScanner = dynamic(() => import('./components/QrScanner'), {
  ssr: false,
})

export default function Home() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState<boolean>(false)

  const handleScanResult = async (data: string) => {
    try {
      setResult(data)
      setScanning(false)

      // Make a GET request to fetch the backend TOTP
      const response = await axios.get('http://localhost:3000/api/totp/')
      const backendTOTP = response.data.totp

      // Compare the backend TOTP with the scanned result
      if (data === backendTOTP) {
        console.log('ID is the same') // Log if the TOTP matches
        setUnlocked(true) // Set unlocked state
        setMessage('QR code matched and acknowledgment sent successfully!')

        // Send a POST request with acknowledgment
        await axios.post('http://localhost:3000/api/mqtt/', {
          acknowledgment: true,
        })
      } else {
        setUnlocked(false)
        setMessage('QR code does not match the backend data.')
      }
    } catch (error) {
      console.error('Error during QR code processing:', error)
      setMessage('An error occurred. Please try again.')
      setUnlocked(false)
    }
  }

  const handleError = () => {
    setScanning(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-4xl font-bold">QR Code Scanner</h1>

      {!scanning && !unlocked && (
        <Button onClick={() => setScanning(true)}>
          Open Camera and Scan QR Code
        </Button>
      )}

      {scanning && (
        <QrScanner
          onResult={handleScanResult}
          onError={handleError}
          onClose={() => setScanning(false)}
        />
      )}

      {unlocked && (
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-green-600">Unlocked</h2>
          <p className="text-lg text-gray-700">
            The QR code matched successfully.
          </p>
        </div>
      )}

      {result && !unlocked && (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Scanned Result:</h2>
          <p className="text-xl bg-muted p-4 rounded-lg">{result}</p>
          <Button variant="outline" onClick={() => setResult(null)}>
            Clear Result
          </Button>
        </div>
      )}

      {message && (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Message:</h2>
          <p className="text-xl bg-info p-4 rounded-lg">{message}</p>
        </div>
      )}
    </main>
  )
}

