export default function UsernameInputs({setUserNameProps,  userNameProps }) {
  const { userName } =   userNameProps ;
  return (
    <>
         <label>
          Username
        </label>
        <input
         disabled={true}
          type="text" placeholder={'userName' }
          value={userName} 
          onChange={ev => setUserNameProps(ev.target.value)}
        />
    </>
  );
}

///make this as Customer