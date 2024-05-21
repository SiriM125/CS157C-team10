import Image from 'next/image'
import Link from 'next/link'
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    
    <main>
      <Navbar/>
      
      {/* For the top, colorful part */}
      <div className = "launchpage_bg">
      <br/><br/><br/><br/><br/>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            A simple tool to boost productivity.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The casual one-stop solution for concurrent communication and file sharing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/login"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>

            {/* <Link href="/api/test_data">
              <code className="font-mono font-bold">api/index.py</code>
            </Link> */}
          </div>
        </div>
        <br/><br/> 
      </div>

      {/* Moar details */}

      <div className = "text-center split-layout">
        <div className = "left-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bold">
              Invite your peers or coworkers into a Lounge.
            </p>
            <br/>
            <p>
              Your main hub for communication and more.
            </p>
          </div>
        </div>
        <div className = "right-half">
          <div>
              <Image
                src="/loungeChair.png"
                alt="MAWLS app"
                width={400}
                height={400}
              />
            </div>
        </div>
      </div>

      <div className = "text-center split-layout launchpage_alt_bg">
        <div className = "left-half">
          <div>
              <Image
                src="/fileTransfer_transparent.png"
                alt="MAWLS app"
                width={400}
                height={400}
              />
            </div>
        </div>
        <div className = "right-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bold">
              View and organize your Lounge's files
            </p>
            <br/>
            <p> No need to scroll your messages in search of files. </p>
            <p> Just see it all in one, simple file hierarchy. </p>
          </div>
        </div>
      </div>

      <div className = "text-center split-layout">
        <div className = "left-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bold">
              Build your team
            </p>
            <br/>
            <p>
              It takes more than one person to truly build something beautiful.
            </p>
          </div>
        </div>
        <div className = "right-half">
          <div>
              <Image
                src="/roles.png"
                alt="MAWLS app"
                width={400}
                height={400}
              />
            </div>
        </div>
      </div>
      
      <div className = "text-center launchpage_alt_bg">
        <br/><br/>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Work smarter, not harder.
        </h1>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Let's get to work.
        </h1>
        <br/>
        <a
          href="/login"
          className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign up now
        </a>
        

        <br/><br/>

        {/* <DataComponent/> */}

      </div>

    </main>
  )
}

