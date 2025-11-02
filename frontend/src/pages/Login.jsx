import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      // Redirect to the page they were trying to access, or dashboard
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    loginWithGoogle()
  }

  return (
    <div className="bg-black min-h-screen min-w-screen relative">
      {/* Decorative Background Elements */}
      <div className="w-[95vw] h-[80vh] blur-[60px] bg-[#101E39] rounded-t-full absolute bottom-0 left-[2%]"></div>
      <div className="absolute w-50 h-50 bg-[#61217E] rounded-full left-[25%] z-0"></div>
      <div className="absolute w-40 h-40 bg-[#61217E] rounded-full left-[65%] top-[15%] z-0"></div>

      {/* Auth Box */}
      <div className="bg-[#11111161] backdrop-blur-2xl relative left-1/2 top-16 -translate-x-1/2 rounded-3xl w-[480px] flex flex-col items-center justify-center text-white shadow-2xl p-8 z-10">
        {/* Logo */}
        <div className="text-2xl font-bold mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-white">Open</span>
          <span className="text-[#7FFF00]">Innovate</span>
        </div>
        
        <h1 className="text-5xl mb-4">Log In</h1>
        <h2 className="text-center mb-8 text-gray-300">Login Your Account to dive into thriving ecosystem of OpenInnovation.</h2>
        
        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="p-px mx-2 my-5 bg-gradient-to-br from-[#336DAE] to-[#61217E] relative rounded-3xl">
            <div className="rounded-3xl p-3 flex bg-[#090909] items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              <input
                className="mx-2 outline-none border-none ring-0 text-white bg-transparent flex-1"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="p-px mx-2 my-5 bg-gradient-to-br from-[#336DAE] to-[#61217E] relative rounded-3xl">
            <div className="rounded-3xl p-3 bg-[#090909] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
              <input
                className="mx-2 outline-none border-none text-white ring-0 bg-transparent flex-1"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-gradient-to-br from-[#336DAE] to-[#9A9797] p-px mx-2 my-10 rounded-3xl">
            <button
              type="submit"
              className="w-full p-2 bg-[#1F1F1F] text-white rounded-3xl hover:bg-[#2F2F2F] transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Log In'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mx-2 p-2 bg-[#1F1F1F] border border-[#336DAE] text-white rounded-3xl hover:bg-[#2F2F2F] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-gray-400">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#7FFF00] hover:text-[#6FEF00] font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
