import React, { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <GraduationCap className="w-12 h-12 text-blue-600" />
              <span className="text-4xl font-bold text-gray-800">ElevatEd</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Elevate Your Career Journey
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of students who are accelerating their career growth with 
              personalized learning, AI-powered tools, and expert guidance.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Students Placed</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Partner Companies</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <SignUpForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}