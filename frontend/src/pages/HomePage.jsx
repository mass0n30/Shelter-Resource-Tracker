
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import DashStats from '../components/DashStats';

function HomePage() {
  const { user, data, success, SetSuccess, SetLoading, SetNewFetch } = useOutletContext();

  return (
    <div className='contentWrapper'>
      <DashStats data={data} />
    </div>
  )
}

export default HomePage;