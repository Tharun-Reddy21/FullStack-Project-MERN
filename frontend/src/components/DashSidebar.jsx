import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user || {});
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/sign-in');
    } catch (error) {
      console.log(error.message);
    }
  };

  const baseItem =
    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap';

  const active = 'bg-gray-200 text-gray-900';
  const inactive = 'text-gray-600 hover:bg-gray-100';

  const itemClass = (isActive) =>
    `${baseItem} ${isActive ? active : inactive}`;

  return (
    <aside
      className="
        bg-white border-b sm:border-b-0 sm:border-r border-gray-200
        rounded-b-lg sm:rounded-none
        w-full sm:w-[20vw] sm:min-w-60 sm:max-w-[320px]
      "
    >
      <nav
        className="
          flex flex-row flex-wrap sm:flex-col
          gap-1 p-2
          h-auto sm:h-screen
          overflow-visible sm:overflow-y-auto
        "
      >
        {currentUser?.isAdmin && (
          <Link to="/dashboard?tab=dash" className={itemClass(tab === 'dash' || !tab)}>
            <HiChartPie className="text-lg shrink-0" />
            <span>Dashboard</span>
          </Link>
        )}

        <Link to="/dashboard?tab=profile" className={itemClass(tab === 'profile')}>
          <HiUser className="text-lg shrink-0" />
          <span>Profile</span>
          <span className="ml-1 text-xs bg-gray-300 px-2 py-0.5 rounded">
            {currentUser?.isAdmin ? 'Admin' : 'User'}
          </span>
        </Link>

        {currentUser?.isAdmin && (
          <Link to="/dashboard?tab=posts" className={itemClass(tab === 'posts')}>
            <HiDocumentText className="text-lg shrink-0" />
            <span>Posts</span>
          </Link>
        )}

        {currentUser?.isAdmin && (
          <>
            <Link to="/dashboard?tab=users" className={itemClass(tab === 'users')}>
              <HiOutlineUserGroup className="text-lg shrink-0" />
              <span>Users</span>
            </Link>

            <Link to="/dashboard?tab=comments" className={itemClass(tab === 'comments')}>
              <HiAnnotation className="text-lg shrink-0" />
              <span>Comments</span>
            </Link>
          </>
        )}

        <button
          onClick={handleSignout}
          className={`${baseItem} text-red-600 hover:bg-red-50 sm:mt-auto`}
        >
          <HiArrowSmRight className="text-lg shrink-0" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
