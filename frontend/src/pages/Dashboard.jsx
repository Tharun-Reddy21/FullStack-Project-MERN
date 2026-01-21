import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import Posts from '../components/Posts';
import Users from '../components/Users';
import Comments from '../components/Comments';
import DashboardComponent from '../components/DashboardComponent';



export default function Dashboard() {

  const location = useLocation();
  const  [tab,setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search] );

  return (
    <div className='min-h-screen flex gap-14 flex-col md:flex-row'>
      <div className='w-fit md:w-56'>
        <DashSidebar/>
        
      </div>
      {tab === 'profile' && <DashProfile/>}
      {tab === 'posts' && <Posts/>}
      {tab === 'users' && <Users/>}
      {tab === 'comments' && <Comments/>}
      {tab === 'dash' && <DashboardComponent/>}


    </div>
  )
}
