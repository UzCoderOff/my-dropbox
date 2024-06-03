import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import Logo from "../../assets/dropbox.png";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Link } from "react-router-dom";

const NavbarPanel = () => {
  const [openNav, setOpenNav] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <a href="/">
          <img src={Logo} alt="" className="h-20" />
        </a>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto w-full ">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <div className="">{navList}</div>
        <div className="flex items-center gap-x-1">
          <Button variant="text" size="sm" className=" text-blue-500">
            <span>{auth.currentUser.displayName}</span>
          </Button>
          <Menu>
            <MenuHandler>
              <IconButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem
                onClick={() => {
                  const newUsername = prompt("Enter new username:");
                  if (newUsername !== null && newUsername.trim() !== "") {
                    updateProfile(auth.currentUser, {
                      displayName: newUsername,
                    })
                      .then(() => {
                        window.location.reload();
                      })
                      .catch((error) => {
                        console.error("Error updating username:", error);
                      });
                  }
                }}
              >
                Edit Username
              </MenuItem>
              <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
        {/* <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton> */}
      </div>
      {/* <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex flex-col items-start gap-y-1">
            <Menu>
              <MenuHandler>
                <IconButton>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => alert("Edit Username")}>
                  Edit Username
                </MenuItem>
                <MenuItem onClick={() => alert("Logout")}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </MobileNav> */}
    </Navbar>
  );
};

export default NavbarPanel;
