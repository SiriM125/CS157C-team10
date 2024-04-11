import Image from 'next/image'
import Link from 'next/link'
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar/>
      
      <div className="text-center about_bg">
          <br/><br/><br/><br/><br/>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our story is not THAT crazy... yet
          </p>
          <br/><br/><br/>
      </div>

      {/* More details */}

      <div className = "text-left center_paragraph">
        <br/><br/>

        <p className = "sm:text-2xl font-bold">
          MAWLS began as a class project
        </p>
        <br/>
        <p>
          Yep, it was not some random, billion dollar idea that sprouted from geniuses, 
          who then went off to build a tech empire. 
          Rather, it was a means for 3 random college students (Bryan, Siri, and Steven) 
          to get some practical development experience using NoSQL databases. 
          More specifically, using the column database Cassandra.
        </p>

        <br/>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/Cassandra.png"
            alt="cassandra"
            width={200}
            height={200}
          />
        </div>

        <br/>
        <br/>

        <p className = "sm:text-2xl font-bold">
          Coming up with the idea
        </p>
        <br/>
        <p>
          Of course, we didn't exactly jump into this idea at first. 
          In fact, we did not came up with it until the last minute. 
          We were instead looking at other options, like inventory management or e-commerce. 
          But, as we juggled with the pros and cons of each idea with our database of choice, 
          we eventually found ourselves in a slump, with no idea what project to make. 
        </p>  
        
        <br/>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/noidea.jpeg"
            alt="noidea"
            width={300}
            height={300}
          />
        </div>
        <br/>
        <br/>

        <p>  
          It was only when we started considering what WE would like, as college students, 
          did the idea of MAWLS came to be. As college students, we are often thrown into group projects,
          and many project these days are done online, or at least have some part online. Often times, this 
          requires peers to share files with each other. The problem? These files tend to get lost as more messages 
          are passed. If only there was a way to talk and share files in an organized manner in one go... and thus, 
          MAWLS came to be. 
        </p> 
        <br/>
        <p> 
          After further considerations (i.e. tools to use and whether the app fits with the database in use), we decided to move forward with this idea. 
          As of now, the idea has yet to come to fruition, but it remains well within the realm of possibility.
        </p>

        <br/><br/>
        
        <p className = "sm:text-2xl font-bold">
          Challenges
        </p>

        <br/>
        <p>
          Of course, we have our fair share of challenges, with more to come in the foreseeable future. 
          Not all of our members were skilled with frontend, and so we started with a mostly blank slate.
          Furthermore, given the time restraints, presence of other classes, and our small team, 
          we have to allocate our personnel and time with great care. However, as one can see from what 
          is here right now, we managed, and picked up some things here and there. 
        </p>
        <br/>
        <p>
          The backend will be an entirely different beast to handle, and problems will undoubtedly arise 
          as we go deeper into implementations. Fortunately, all of our members have at least some 
          experience with using Cassandra, and making Java programs to perform queries. Right now, it's all a matter 
          of figuring out how to use the CQLAlchemy library for Python manipulate and access Cassandra. 
        </p>

      </div>

      <br/><br/> <br/><br/>
    </main>
  )
}
