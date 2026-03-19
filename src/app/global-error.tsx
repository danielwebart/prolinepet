'use client'
 
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-semibold mb-4">Algo deu errado!</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => reset()}>Tentar novamente</button>
        </div>
      </body>
    </html>
  )
}
