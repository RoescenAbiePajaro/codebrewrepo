'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import UserEditableImage from "./UserEditableImage";
import {useProfile} from "@/components/UseProfile";
import {useState} from "react";

export default function UserForm({user,onSave}) {
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
// //   const [postalCode, setPostalCode] = useState(user?.postalCode || '');
// //   const [city, setCity] = useState(user?.city || '');
//   const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const {data:loggedInUserData} = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'firstName') setFirstName(value);
    if (propName === 'lastName') setLastName(value);
    // if (propName === 'postalCode') setPostalCode(value);
    // if (propName === 'city') setCity(value);
    // if (propName === 'country') setCountry(value);
  }

  return (
    <div className="md:flex gap-4">
      <div>

        <div className="p-2 rounded-lg relative max-w-[120px]">
          <UserEditableImage link={image} setLink={setImage} />
        </div>

      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name:userName,firstName,lastName, image, phone, admin,
            streetAddress, 
            // city, country, postalCode,
          })
        }
      >
        <label>
          Username
        </label>
        <input
          type="text" placeholder="Username"
          value={userName} onChange={ev => setUserName(ev.target.value)}
        />

{/* {check this if correct} */}
        <label>First Name</label>
        <input
         disabled={true}
          type="text" placeholder={'firstName'}
          value={user.firstName} 
          onChange={ev => setFirstName(ev.target.value)}
        />

        <label>Last Name</label>
        <input
        disabled={true}
        type="text" placeholder={'lastName'}
        value={user.lastName} 
      
        />


        <label>Email</label>
        <input
          type="email"
          disabled={true}
          value={user.email}
          placeholder={'email'}
        />


        <AddressInputs
          addressProps={{phone, streetAddress}}
          setAddressProp={handleAddressChange}
        />
        {loggedInUserData.admin && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb" type="checkbox" className="" value={'1'}
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}