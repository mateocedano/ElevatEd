import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF4F1] via-white to-[#D4EAE4] flex items-center justify-center p-6">
      <a
        href="/advisor-login"
        className="absolute top-6 right-6 px-6 py-2.5 bg-white text-[#1B3D2F] rounded-lg font-semibold hover:bg-[#F0F9F7] border border-[#A7D7C5] transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Advisor Log In
      </a>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <img src="/Logo_2.0.png" alt="ElevatEd" className="h-16 w-auto" />
            </div>

            <h1 className="text-5xl font-bold text-[#1B3D2F] mb-6">
              Elevate Your Career Journey
            </h1>

            <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">
              Join thousands of students who are accelerating their career growth with
              personalized learning, AI-powered tools, and expert guidance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#1B3D2F] mb-2">10K+</div>
                <div className="text-[#6B7280]">Students Placed</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#A7D7C5] mb-2">500+</div>
                <div className="text-[#6B7280]">Partner Companies</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#1B3D2F] mb-2">95%</div>
                <div className="text-[#6B7280]">Success Rate</div>
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