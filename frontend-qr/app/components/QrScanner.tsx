'use client'

import { Button } from './ui/button'
import dynamic from 'next/dynamic'
import QrScanner from 'qr-scanner'
import { useEffect, useRef, useState } from 'react'

interface QrScannerComponentProps {
  onResult: (result: string) => void
  onError?: (error: Error) => void
  onClose: () => void
}

export default function QrScannerComponent({ onResult, onError, onClose }: QrScannerComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoRef.current) return

    const qrScannerr = new QrScanner(
      videoRef.current,
      (result) => {
        onResult(result.data)
        qrScannerr.stop()
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    )

    qrScannerr.start().catch((err: Error) => {
      setError(err.message)
      if (onError) onError(err)
    })

    return () => {
      qrScannerr.destroy()
    }
  }, [onResult, onError])

  return (
    <div className="relative w-full max-w-md mx-auto">
      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="w-full rounded-lg" />
          <Button 
            className="absolute top-2 right-2" 
            variant="secondary" 
            onClick={onClose}
          >
            Close
          </Button>
        </>
      )}
    </div>
  )
}
// Import QrScanner dynamically to avoid SSR issues
export const qrScannerr = dynamic(() => import('../components/QrScanner'), {
  ssr: false,
})

