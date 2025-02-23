import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import path from "src/constants/path";

export interface UserSideNavLinks {
  title: string;
  linkTo: string;
  children: ReactNode;
}

export const userSideNavLinks: UserSideNavLinks[] = [
  {
    title: 'Profile',
    linkTo: path.profile,
    children: (
      <svg
        className="fill-blue w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="#000000"
        viewBox="0 0 256 256"
      >
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
      </svg>
    ),
  },
  {
    title: 'Change Password',
    linkTo: path.changePassword,
    children: (
      <svg
        className='fill-blue w-5 h-5'
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        fill='#000000'
        viewBox='0 0 256 256'
      >
        <path d='M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z'></path>
      </svg>
    ),
  },
  {
    title: 'Addresses',
    linkTo: path.changePassword,
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#3DB1FF"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>

    ),
  },
  {
    title: 'Login sessions',
    linkTo: path.loginSession,
    children: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#3DB1FF"
        className="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
      </svg>

    ),
  },
];

export const ReturnUserNavLink = ({ title, linkTo, children }: UserSideNavLinks) => {
  return (
    <NavLink
      to={linkTo}
      className={({ isActive }) =>
        classNames('flex items-center mt-3 capitalize transition-colors py-2 px-2 rounded-md hover:bg-sky-100', {
          'text-sky-500 bg-sky-50': isActive,
          'text-gray-700': !isActive
        })
      }
    >
      <div className='mr-3 h-[22px] w-[22px]'>
        {children}
      </div>
      {title}
    </NavLink>

  )
}
