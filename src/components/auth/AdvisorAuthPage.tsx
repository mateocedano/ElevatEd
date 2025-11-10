import React, { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import AdvisorLoginForm from './AdvisorLoginForm'

export default function AdvisorAuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <a
        href="/"
        className="absolute top-6 right-6 px-6 py-2.5 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 border border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Student Login
      </a>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <GraduationCap className="w-12 h-12 text-blue-600" />
              <span className="text-4xl font-bold text-gray-800">ElevatEd</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Advisor Portal
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access your advisor dashboard to manage students, track progress,
              and provide personalized guidance to help them succeed.
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

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <AdvisorLoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
