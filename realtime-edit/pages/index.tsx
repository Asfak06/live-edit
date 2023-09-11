import socket from '../utils/socket';
import { IJitsiMeetingProps } from '@jitsi/react-sdk/lib/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const JitsiMeeting = dynamic<IJitsiMeetingProps>(() => import('@jitsi/react-sdk').then((mod) => mod.JitsiMeeting), { ssr: false });

export default function Home() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });


  useEffect(() => {
    socket.on('input-change', (data: { id: string, value: string }) => {
      setFormData(prev => ({ ...prev, [data.id]: data.value }));
    });

    return () => {
      socket.off('input-change');
    };
  }, []);

  const handleJitsiIFrameRef1 = (iframeRef: any) => {
    iframeRef.style.border = '10px solid #3d3d3d';
    iframeRef.style.background = '#3d3d3d';
    iframeRef.style.height = '100vh';
    iframeRef.style.marginBottom = '20px';
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    socket.emit('input-change', { id, value });
  };

  return (
    <>
      <div className='relative'>
        <div className='w-1/3 pr-22 fixed top-0'>
          <JitsiMeeting
            domain="meet.medico.bio"
            jwt={`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWV0Lm1lZGljby5iaW8iLCJhdWQiOiJtZWRpY28iLCJpc3MiOiJtZWRpY28iLCJjb250ZXh0Ijp7Imdyb3VwIjoibWVldC5tZWRpY28uYmlvIiwidXNlciI6eyJhZmZpbGlhdGlvbiI6Im1lbWJlciJ9fSwicm9vbSI6InJvb20tMDEifQ.Njoa47vYAy13ay9AICQhE_VFdEwBzrfbCKauuU6oKwg`}
            roomName={`room-01`}
            onApiReady={(externalApi) => {
              externalApi.addListener('participantJoined', async (object) => {
                externalApi.executeCommand('setTileView', true);
              })
            }}
            configOverwrite={{
              disableTileView: false,
              prejoinConfig: true,
              tileview: true,
              toolbarConfig: {
                alwaysVisible: true
              },
            }}
            getIFrameRef={handleJitsiIFrameRef1}
          />
        </div>
        <div className='w-2/3 pl-24 absolute right-0'>
          <div className='h-screen  flex flex-col items-center justify-center'>
            <form className='w-1/2'>
              <div className="mb-6 w-100">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                <input type="name" id="name" value={formData.name} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" id="email"  value={formData.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your phone</label>
                <input type="text" id="phone"  value={formData.phone} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
