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


      <div className = "text-left split-layout">
        <div className = "left-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bol">
              Join or Host Lounges
            </p>
            <br/>
            <p className = "text-left">
              Lounges serves as the main hub for a group of people to communicate and share files. 
              Each Lounge has its own text messaging channels and a dedicated file storage. 
              Depending on the member's permissions, some may only see/access select text channels and folders.
            </p>
          </div>
        </div>
        <div className = "right-half">
          <div>
              <Image
                src="/loungesSidebar.png"
                alt="lounges"
                width={75}
                height={100}
              />
            </div>
        </div>
      </div>

      <div className = "text-left split-layout launchpage_alt_bg">
        <div className = "left-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bol">
              Communicate through text channels
            </p>
            <br/>
            <p className = "text-left">
              Message your peers through the text channels of a Lounge. 
              Text channels keep the conversations organized and assists in 
              ensuring that people do not go off track.
            </p>
          </div>
        </div>
        <div className = "right-half">
          <div>
              <Image
                src="/newChat.png"
                alt="msg"
                width={350}
                height={350}
              />
            </div>
        </div>
      </div>

      <div className = "text-left split-layout">
        <div className = "left-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bol">
              Navigate Lounge Files
            </p>
            <br/>
            <p className = "text-left">
              Files follow a simple hierarchy with the use of folders, 
              much like the file system of your computer. 
              This keeps things organized in a simple, intuitive manner. 
            </p>
          </div>
        </div>
        <div className = "right-half">
          <div>
              <Image
                src="/newFile.png"
                alt="fileHierarchy"
                width={350}
                height={200}
              />
            </div>
        </div>
      </div>

      <div className = "text-left split-layout launchpage_alt_bg">
        <div className = "left-half">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className = "sm:text-4xl font-bol">
              Invite People With Ease
            </p>
            <br/>
            <p className = "text-left">
              Each Lounge is given a corresponding Id. It is displayed to be copied through a simple click, and can be shared with ease.
            </p>
          </div>
        </div>
        <div className = "right-half">
          <div>
              <Image
                src="/roles_transparent.png"
                alt="roles"
                width={350}
                height={200}
              />
            </div>
        </div>
      </div>

    </main>
  )
}
