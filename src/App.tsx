import { useState } from 'react'

export default function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemix = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to remix text')
      }
      
      setOutputText(data.result)
    } catch (error) {
      console.error('Error remixing text:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setOutputText('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Content Remixer</h1>
        
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here to remix..."
            className="w-full h-40 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={handleRemix}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Remixing...' : 'Remix Text'}
          </button>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              Error: {error}
            </div>
          )}
          
          {outputText && (
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold mb-2">Remixed Output:</h2>
              <p className="whitespace-pre-wrap">{outputText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
