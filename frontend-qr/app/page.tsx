'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from './components/ui/button'

// Import QrScanner dynamically to avoid SSR issues
const QrScanner = dynamic(() => import('./components/QrScanner'), {
  ssr: false,
})

export default function Home() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleScanResult = (data: string) => {
    setResult(data)
    setScanning(false)
  }

  const handleError = (error: Error) => {
    console.error('QR Scanner error:', error)
    setScanning(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-4xl font-bold">QR Code Scanner</h1>
      
      {!scanning && (
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

      {result && (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Scanned Result:</h2>
          <p className="text-xl bg-muted p-4 rounded-lg">{result}</p>
          <Button variant="outline" onClick={() => setResult(null)}>
            Clear Result
          </Button>
        </div>
      )}
    </main>
  )
}

