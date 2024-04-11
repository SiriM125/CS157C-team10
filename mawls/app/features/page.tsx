import Image from 'next/image'
import Link from 'next/link'
import Navbar from "@/components/Navbar";

export default function Home() {
  return (    
    <main>
      <Navbar/>
      <div className="text-center features_bg">
          <br/><br/><br/><br/><br/>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Features
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Learn what you can do using MAWLS.
          </p>
          <br/><br/><br/>
      </div>


    </main>
  )
}
