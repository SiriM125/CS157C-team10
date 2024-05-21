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





// import Image from 'next/image'
// import Link from 'next/link'

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <Link href="/api/python">
//             <code className="font-mono font-bold">api/index.py</code>
//           </Link>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{' '}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Docs{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Learn{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Templates{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Explore the Next.js 13 playground.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Deploy{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   )
// }
