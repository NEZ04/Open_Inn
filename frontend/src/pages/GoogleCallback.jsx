import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { checkAuth } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const status = searchParams.get('status')
      
      if (status === 'failure') {
        // Redirect to login with error message
        navigate('/login?error=Google authentication failed')
        return
      }

      // If success, check authentication and redirect to dashboard
      try {
        await checkAuth()
        navigate('/dashboard')
      } catch (error) {
        console.error('Auth check failed:', error)
        navigate('/login?error=Authentication failed')
      }
    }

    handleCallback()
  }, [searchParams, navigate, checkAuth])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7FFF00] mx-auto mb-4"></div>
        <p className="text-xl">Completing authentication...</p>
      </div>
    </div>
  )
}

export default GoogleCallback
